import store from "../stores/ConfiguratorStore";
import generalStore from "../stores/GeneralStore";

export const postRequest = async ({ url, body, isFormData = false, headers = {} }) => {
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


const saveDesign = async (portfolioId:string) => {
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

      const designData = await postRequest({
        url: `${baseUrl}/design?portfolioId=${portfolioId}`,
        body: designInfo,
      });

      console.log("Design saved successfully:", designData);
      const designId = designData?.id;
      if (!designId) throw new Error("Design ID not found!");
      generalStore.setDesignId(designId);
      generalStore.setIsSaved(true);
      
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

export default saveDesign;