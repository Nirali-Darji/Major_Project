import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import ApiFetcher from "../utils/ApiFetcher";
import store from "../stores/ConfiguratorStore";
import { reaction } from "mobx";

const TinyHomeSelector = () => {
  const { data, loading, error } = ApiFetcher({
    endpoint: `${import.meta.env.VITE_API_BASE_URL}/styles/`,
  });

  const { data: moduleData, loading: moduleLoading, error: moduleError } = ApiFetcher({
    endpoint: `${import.meta.env.VITE_API_BASE_URL}/modules`,
  });

  const [selectedMaterials, setSelectedMaterials] = useState({});
  const [totals, setTotals] = useState({
    totalBedRooms: 0,
    totalBathrooms: 0,
    totalSize: 0,
  });

  useEffect(() => {
    const dispose = reaction(
      () => store.models.slice(), // Track models
      (models) => {
        console.log("Models changed, recalculating totals");
        if (moduleData && models.length > 0) {
          const updatedTotals = totalUtility(moduleData, models);
          setTotals(updatedTotals);
        }
      }
    );
  
    return () => dispose(); // Clean up reaction
  }, [moduleData]);

  if (loading || moduleLoading) return <div>Loading...</div>;
  if (error || moduleError) return <div>Error loading data!</div>;

  const handleMaterialSelect = (substyleIndex, material) => {
    setSelectedMaterials((prev) => ({
      ...prev,
      [substyleIndex]: material,
    }));
  };

  return (
    <div className="p-6 w-90 mx-auto bg-white shadow-md space-y-4 max-h-screen overflow-y-auto z-10">
      <div className="text-center">
        <h2 className="text-lg font-bold">
          {totals.totalBedRooms} Bedrooms {totals.totalBathrooms} Bathroom {totals.totalSize} sqft
        </h2>
      </div>
      <div className="">
        {data?.subStyleList?.length > 0 ? (
          data.subStyleList.map((substyle, index) => (
            <div key={index} className="border-b pb-4 mb-4">
              <div className="flex justify-center">
                <div className="w-full h-60 bg-gray-100">
                  <img
                    src={selectedMaterials[index]?.imageURL || substyle.imageURL}
                    alt={substyle.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h3 className="font-semibold text-2xl mt-2 text-center">
                {substyle.name}
              </h3>
              <div className="flex justify-center mt-2">
                {substyle.materialList.map((material, matIndex) => (
                  <div
                    key={matIndex}
                    className={`w-15 h-15 flex justify-center items-center cursor-pointer border-2 ${
                      selectedMaterials[index]?.name === material.name ? "border-blue-500" : "border-transparent"
                    }`}
                    onClick={() => handleMaterialSelect(index, material)}
                  >
                    <img
                      src={material.imageURL}
                      alt={material.name}
                      className="w-[80%] h-[80%] object-cover"
                    />
                  </div>
                ))}
              </div>
              {selectedMaterials[index] && (
                <p className="mt-2 text-center text-blue-600">{selectedMaterials[index].name}</p>
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
  const dataArray = Array.isArray(moduleData) ? moduleData : [moduleData];
  const filteredDesigns = models
    .map((model) => dataArray?.find((item) => item?.id === model.gltfId))
    .filter(Boolean);

  let totalBedRooms = 0;
  let totalBathrooms = 0;
  let totalSize = 0;

  for (let i = 0; i < filteredDesigns.length; i++) {
    totalBedRooms += filteredDesigns[i]?.noOfBedrooms || 0;
    totalBathrooms += filteredDesigns[i]?.noOfBathrooms || 0;
    totalSize += filteredDesigns[i]?.size || 0;
  }

  return {
    totalBedRooms,
    totalBathrooms,
    totalSize,
  };
};
