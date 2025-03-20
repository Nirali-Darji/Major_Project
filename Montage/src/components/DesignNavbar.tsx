import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import generalStore from "../stores/GeneralStore";
import ApiFetcher from "../utils/ApiFetcher";
import { observer } from "mobx-react-lite";
import store from "../stores/ConfiguratorStore";
import { ScreenshotButton } from "./Temp";

const designInfo = {
  name: generalStore.currentDesignName,
  styleId: 1,
  version: "0.0.1",
  configuredStyle: generalStore.configuredStyle,
  moduleArr: store.models.map((model) => ({
    moduleId: model.gltfId,
    lock: true,
    scale: model.scale,
    rotate: model.rotation,
    // position:model.position
  })),
};

function DesignNavbar() {
  const navigate = useNavigate();
  const { data, loading, error } = ApiFetcher({
    endpoint: `${import.meta.env.VITE_API_BASE_URL}/portfolios`,
  });
  // if (loading) return <>loading....</>;
  // if (error) return <div>Error loading data!</div>;
  console.log("Data", data);
  const portfolio = data?.portFolios?.find(
    (p) => p.name === generalStore.selectedPortfolio
  );
  const portfolioId = portfolio?.portfolioId;

  const handleSavedesign = async () => {
    if (!portfolioId) {
      console.error("Portfolio ID is missing!");
      return;
    }

    const designEndpoint = `${
      import.meta.env.VITE_API_BASE_URL
    }/design?portfolioId=${portfolioId}`;
    const portfolioEndpoint = `${
      import.meta.env.VITE_API_BASE_URL
    }/portfolio/${portfolioId}/design`;

    try {
      const designResponse = await fetch(designEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(import.meta.env.VITE_AUTH_TOKEN
            ? { Authorization: `Bearer ${import.meta.env.VITE_AUTH_TOKEN}` }
            : {}),
        },
        body: JSON.stringify(designInfo),
      });

      if (!designResponse.ok) {
        throw new Error(
          `Error saving design: ${designResponse.status} ${designResponse.statusText}`
        );
      }

      const designData = await designResponse.json();
      console.log("Design saved successfully:", designData);

      const designId = designData?.id;
      if (!designId) {
        throw new Error("Design ID not found in response!");
      }

      const portfolioResponse = await fetch(portfolioEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(import.meta.env.VITE_AUTH_TOKEN
            ? { Authorization: `Bearer ${import.meta.env.VITE_AUTH_TOKEN}` }
            : {}),
        },
        body: JSON.stringify({ designIds: [designId] }),
      });

      if (!portfolioResponse.ok) {
        throw new Error(
          `Error adding design to portfolio: ${portfolioResponse.status} ${portfolioResponse.statusText}`
        );
      }

      const portfolioData = await portfolioResponse.json();
      console.log("Design added to portfolio successfully:", portfolioData);

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
          onClick={handleSavedesign}
        >
          Save
        </button>
      </div>
      <button className="h-10 w-10 mr-4 flex justify-center items-center">
        <CgProfile className="" size={30} />
      </button>
    </div>
  );
}

export default observer(DesignNavbar);
