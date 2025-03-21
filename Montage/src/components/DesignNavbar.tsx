import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import generalStore from "../stores/GeneralStore";
import { observer } from "mobx-react-lite";
import store from "../stores/ConfiguratorStore";
import ApiFetcher from "../utils/ApiFetcher";

const postRequest = async ({ url, body, isFormData = false, headers = {} }) => {
  try {
    const authHeaders = import.meta.env.VITE_AUTH_TOKEN
      ? { Authorization: `Bearer ${import.meta.env.VITE_AUTH_TOKEN}` }
      : {};

    const requestOptions = {
      method: "POST",
      headers: isFormData
        ? authHeaders // Don't set 'Content-Type', FormData does it automatically
        : {
            "Content-Type": "application/json",
            ...authHeaders,
            ...headers,
          },
      body: isFormData ? body : JSON.stringify(body),
    };

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("POST Request Error:", error);
    throw error;
  }
};

function DesignNavbar() {
  const navigate = useNavigate();
  const { data } = ApiFetcher({
    endpoint: `${import.meta.env.VITE_API_BASE_URL}/portfolios`,
  });

  const portfolio = data?.portFolios?.find(
    (p) => p.name === generalStore.selectedPortfolio
  );
  const portfolioId = portfolio?.portfolioId;

  const handleSaveDesign = async () => {
    if (!portfolioId) {
      console.error("Portfolio ID is missing!");
      alert("Portfolio not found!");
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const designInfo = {
        name: generalStore.currentDesignName,
        styleId: 1,
        version: "0.0.1",
        configuredStyle: generalStore.configuredStyle,
        moduleArr: store.models.map((model) => ({
          moduleId: model.gltfId,
          lock: true,
          scale: model.scale,
          rotation: model.rotation[1],
          position: model.position,
        })),
      };

      // Step 1: Save Design
      const designData = await postRequest({
        url: `${baseUrl}/design?portfolioId=${portfolioId}`,
        body: designInfo,
      });

      console.log("Design saved successfully:", designData);
      const designId = designData?.id;
      if (!designId) throw new Error("Design ID not found!");

      // Step 2: Add Design to Portfolio
      await postRequest({
        url: `${baseUrl}/portfolio/${portfolioId}/design`,
        body: { designIds: [designId] },
      });

      console.log("Design added to portfolio successfully");
      alert("Design saved and added to portfolio successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving the design.");
    }
  };

  return (
    <div className="flex justify-between w-full items-center bg-gray-100 border-b-2 border-[#DCDCDC] p-3 z-10">
      <div className="flex items-center gap-10">
        <h2 className="text-2xl">Montage</h2>
        <button className="text-2xl" onClick={() => navigate("/")}>
          {generalStore.selectedPortfolio}
        </button>
        <input
          type="text"
          placeholder="Design Name"
          required
          value={generalStore.currentDesignName}
          onChange={(e) => generalStore.setCurrentDesignName(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:outline-none"
        />
        <button
          className="bg-black text-white px-8 py-2 rounded-lg hover:bg-gray-600"
          onClick={handleSaveDesign}
        >
          Save
        </button>
      </div>
      <button className="h-10 w-10 mr-4 flex justify-center items-center">
        <CgProfile size={30} />
      </button>
    </div>
  );
}

export default observer(DesignNavbar);
