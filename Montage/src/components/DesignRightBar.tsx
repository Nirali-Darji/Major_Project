import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import ApiFetcher from "../utils/ApiFetcher";
import store from "../stores/ConfiguratorStore";
import { reaction, toJS } from "mobx";
import generalStore from "../stores/GeneralStore";

const TinyHomeSelector = () => {
  const { data, loading, error } = ApiFetcher({
    endpoint: `${import.meta.env.VITE_API_BASE_URL}/styles/`,
  });

  const { data: moduleData, loading: moduleLoading, error: moduleError } = ApiFetcher({
    endpoint: `${import.meta.env.VITE_API_BASE_URL}/modules`,
  });

  const [selectedMaterials, setSelectedMaterials] = useState({});
  const [totals, setTotals] = useState({ totalBedRooms: 0, totalBathrooms: 0, totalSize: 0 });

  // useEffect(() => {
  //   if (data?.subStyleList?.length > 0) {
  //     const initialSelection = {};
      
  //     data.subStyleList.forEach((substyle) => {
  //       if (substyle.materialList.length > 0) {
  //         const firstMaterial = substyle.materialList[0];
  //         initialSelection[substyle.name] = firstMaterial;

  //         // Update store with the default material
  //         store.updateTexture(substyle.name, firstMaterial.imageURL);
  //       }
  //     });

  //     setSelectedMaterials(initialSelection);
  //   }
  // }, [data]);
  useEffect(() => {
    if (data?.subStyleList?.length > 0) {
      const initialSelection = {};
  
      data.subStyleList.forEach((substyle) => {
        if (substyle.materialList.length > 0) {
          const firstMaterial = substyle.materialList[0]; // Select first material by default
          initialSelection[substyle.name] = firstMaterial;
  
          generalStore.setSelectedSubstyleId(substyle.name, substyle.id);
          generalStore.setSelectedMaterial(substyle.name, firstMaterial);
        }
      });
  
      setSelectedMaterials(initialSelection);
    }
  }, [data]);
  

  useEffect(() => {
    const dispose = reaction(
      () => store.models.slice(),
      (models) => {
        if (moduleData && models.length > 0) {
          setTotals(totalUtility(moduleData, models));
          console.log('cost :',totalCost(moduleData, models));
        }
      }
    );
    return () => dispose();
  }, [moduleData]);

  if (loading || moduleLoading) 
    return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
  if (error || moduleError) return <div>Error loading data!</div>;

  // const handleMaterialSelect = (substyleName, material) => {
  //   generalStore.setSelectedMaterial(substyleName, material);
  //   setSelectedMaterials((prev) => ({
  //     ...prev,
  //     [substyleName]: material,
  //   }));
    
  //   console.log(material)
  //   store.updateTexture(substyleName, material.imageURL);
  // };
  const handleMaterialSelect = (substyleName: string, substyleId: string, material: any) => {
    generalStore.setSelectedSubstyleId(substyleName, substyleId);
  
    generalStore.setSelectedMaterial(substyleName, material);
    console.log('store :',toJS(generalStore.selectedSubstyleId))
  
    setSelectedMaterials((prev) => ({
      ...prev,
      [substyleName]: material,
    }));
  
    store.updateTexture(substyleName, material.imageURL);
  };

  return (
    <div className="p-6 w-90 mx-auto bg-white shadow-md space-y-4 max-h-screen overflow-y-auto z-10">
      <div className="text-center">
        <h2 className="text-lg font-bold">
          {totals.totalBedRooms} Bedrooms {totals.totalBathrooms} Bathroom {totals.totalSize} sqft
        </h2>
      </div>
      <div>
        {data?.subStyleList?.length > 0 ? (
          data.subStyleList.map((substyle, index) => (
            <div key={index} className="border-b pb-4 mb-4">
              <div className="flex justify-center">
                <div className="w-full h-60 bg-gray-100">
                  <img
                    // src={selectedMaterials[substyle.name]?.imageURL || substyle.imageURL}
                    src={generalStore.selectedMaterials[substyle.name]?.materialData.imageURL || substyle.imageURL}
                    alt={substyle.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h3 className="font-semibold text-2xl mt-2 text-center">{substyle.name}</h3>
              <div className="flex justify-center mt-2">
                {substyle.materialList.map((material, matIndex) => (
                  <div
                    key={matIndex}
                    className={`w-15 h-15 flex justify-center items-center cursor-pointer border-2 ${
                      selectedMaterials[substyle.name]?.name === material.name ? "border-blue-500" : "border-transparent"
                    }`}
                    onClick={() => handleMaterialSelect(substyle.name,substyle.id, material)}
                  >
                    <img
                      src={material.imageURL}
                      alt={material.name}
                      className="w-[80%] h-[80%] object-cover"
                    />
                  </div>
                ))}
              </div>
              {selectedMaterials[substyle.name] && (
                <p className="mt-2 text-center text-blue-600">{selectedMaterials[substyle.name].name}</p>
              )}
            </div>
          ))
        ) : (
          <div>No styles available</div>
        )}
      </div>
    </div>
  );
};

export default observer(TinyHomeSelector);

const totalUtility = (moduleData, models) => {
  if (!Array.isArray(moduleData)) moduleData = [moduleData];
  
  const filteredDesigns = models.map((model) => moduleData.find((item) => item?.id === model.gltfId)).filter(Boolean);

  return filteredDesigns.reduce(
    (acc, design) => {
      acc.totalBedRooms += design?.noOfBedrooms || 0;
      acc.totalBathrooms += design?.noOfBathrooms || 0;
      acc.totalSize += design?.size || 0;
      return acc;
    },
    { totalBedRooms: 0, totalBathrooms: 0, totalSize: 0 }
  );
};

const totalCost = (moduleData, models) => {
  if (!Array.isArray(moduleData)) moduleData = [moduleData];
  
  const filteredDesigns = models.map((model) => moduleData.find((item) => item?.id === model.gltfId)).filter(Boolean);
  return filteredDesigns.reduce(
    (acc, design) => {
      acc.totalCost += design?.pricePerSqft || 0;
      return acc;
    },
    { totalCost: 0 }
  );

}

