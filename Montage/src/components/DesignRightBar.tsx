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

  const {
    data: moduleData,
    loading: moduleLoading,
    error: moduleError,
  } = ApiFetcher({
    endpoint: `${import.meta.env.VITE_API_BASE_URL}/modules`,
  });

  const [selectedMaterials, setSelectedMaterials] = useState({});
  const [totals, setTotals] = useState({
    totalBedRooms: 0,
    totalBathrooms: 0,
    totalSize: 0,
  });
  useEffect(() => {
    if (data?.subStyleList?.length > 0) {
      const initialSelection = {};
      const configuredStyles = [];

      data.subStyleList.forEach((substyle) => {
        if (substyle.materialList.length > 0) {
          const firstMaterial = substyle.materialList[0];

          initialSelection[substyle.name] = firstMaterial;

          configuredStyles.push({
            subStyleId: substyle.id,
            selectedMaterialId: firstMaterial.id,
          });
          store.updateTexture(substyle.name, firstMaterial.imageURL);
        }
      });

      setSelectedMaterials(initialSelection);

      generalStore.setConfiguredStyles(configuredStyles);
    }
  }, [data]);

  useEffect(() => {
    const dispose = reaction(
      () => store.models.slice(), // Watches models array
      (models) => {
        if (moduleData) {
          if (models.length === 0) {
            setTotals({ totalBedRooms: 0, totalBathrooms: 0, totalSize: 0 }); // Reset to zero
          } else {
            setTotals(totalUtility(moduleData, models));
          }

          console.log(
            "cost :",
            models.length > 0 ? totalCost(moduleData, models) : 0
          );
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

  const handleMaterialSelect = (substyleName, subStyleId, material) => {
    generalStore.updateConfiguredStyle(subStyleId, material.id);

    setSelectedMaterials((prev) => ({
      ...prev,
      [substyleName]: material,
    }));

    store.updateTexture(substyleName, material.imageURL);
  };
  return (
    <div className="p-6 w-90 mx-auto bg-white shadow-md space-y-4 h-[calc(105vh-100px)] overflow-y-auto z-10">
      <div className="text-center">
        <h2 className="text-lg font-bold">
          {totals.totalBedRooms} Bedrooms {totals.totalBathrooms} Bathroom{" "}
          {totals.totalSize} sqft
        </h2>
      </div>
      <div>
        {data?.subStyleList?.length > 0 ? (
          data.subStyleList.map((substyle, index) => (
            <div key={index} className="border-b pb-4 mb-4">
              <div className="flex justify-center">
                <div className="w-full h-60 bg-gray-100">
                  <img
                    src={
                      selectedMaterials[substyle.name]?.imageURL ||
                      substyle.imageURL
                    }
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
                      selectedMaterials[substyle.name]?.name === material.name
                        ? "border-blue-500"
                        : "border-transparent"
                    }`}
                    onClick={() =>
                      handleMaterialSelect(substyle.name, substyle.id, material)
                    }
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
                <p className="mt-2 text-center text-blue-600">
                  {selectedMaterials[substyle.name].name}
                </p>
              )}
            </div>
          ))
        ) : (
          <div>No styles available</div>
        )}
      </div>
      <div className="sticky bottom-0 left-0 w-full bg-white shadow-lg p-4 flex justify-between items-center">
        <div>
          <p className="text-lg font-bold">${totals.totalSize * 150}</p>{" "}
          {/* Example cost calculation */}
          <p className="text-xs text-gray-500">Estimated Construction Cost</p>
        </div>
        <button className="bg-black text-sm text-white px-2 py-2 rounded cursor-not-allowed">
          Order Now
        </button>
      </div>
    </div>
  );
};

export default observer(TinyHomeSelector);

const totalUtility = (moduleData, models) => {
  if (!Array.isArray(moduleData)) moduleData = [moduleData];

  const filteredDesigns = models
    .map((model) => moduleData.find((item) => item?.id === model.gltfId))
    .filter(Boolean);

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

  const filteredDesigns = models
    .map((model) => moduleData.find((item) => item?.id === model.gltfId))
    .filter(Boolean);
    console.log("Filtered Design",filteredDesigns)
  // return filteredDesigns.reduce(
  //   (acc, design) => {
  //     acc.totalCost += design?.pricePerSqft || 0;
  //     return acc;
  //   },
  //   { totalCost: 0 }
  // );
  let totalCost = 0;
  for (let i = 0; i < filteredDesigns.length; i++) {
    console.log("index",filteredDesigns[i]);
    console.log(filteredDesigns[i].pricePerSqft);
    totalCost += filteredDesigns[i].pricePerSqft || 0;
  }
  return totalCost;
};
// const totalCost = (moduleData, models) => {
//   let totalCost = 0;

//   if (!Array.isArray(moduleData)) {
//     moduleData = [moduleData];
//   }

//   for (let i = 0; i < models.length; i++) {
//     for (let j = 0; j < moduleData.length; j++) {
//       if (moduleData[j].id === models[i].gltfId) {
//         totalCost += moduleData[j].pricePerSqft || 0;
//         break;
//       }
//     }
//   }

//   return totalCost;
// };
