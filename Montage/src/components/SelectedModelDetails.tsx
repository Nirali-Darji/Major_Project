import React, { useState } from "react";
import ApiFetcher from "../utils/ApiFetcher";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import store from "../stores/ConfiguratorStore";
import { getModelDetails } from "./DesignTools";

function SelectedModelDetails({ isVisible, onClose }) {
  const { data, loading, error } = ApiFetcher({
    endpoint: `${import.meta.env.VITE_API_BASE_URL}/modules`,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data!</div>;

  const { url, gltfId } = getModelDetails(store.selectedModelId);
  const getModelIndexByGltfId = (models, gltfId) => {
    return models.findIndex((model) => model.id === gltfId);
  };

  const modelIndex = getModelIndexByGltfId(data, gltfId);

  return (
    <div
      className={`fixed top-16 right-0 bg-white shadow-lg transform transition-transform duration-500 ease-in-out z-50 max-h-screen overflow-y-auto  ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="w-90 mx-auto p-6">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-600"
        >
          ✕
        </button>
        <h1 className="text-2xl font-bold mb-4">Module Details</h1>

        <div className="border-b py-4">
          <Carousel showThumbs={false} infiniteLoop autoPlay>
            {data[modelIndex]?.images[0]?.map((image, index) => (
              <div key={index}>
                <img
                  src={image}
                  alt={`Module Image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            ))}
          </Carousel>
        </div>

        <div className="border-b py-4">
          <h2 className="text-xl font-semibold">{data[modelIndex]?.name}</h2>
          <p>Description</p>
        </div>

        <div className="border-b py-4">
          <h4 className="text-lg font-semibold">Suggested Use</h4>
          <h5 className="font-medium">Module Size</h5>
          <p>{data[modelIndex]?.size}</p>
          <h5 className="font-medium">Module Height</h5>
          <p>{data[modelIndex]?.height}</p>
          <h5 className="font-medium">Module Width</h5>
          <p>{data[modelIndex]?.width}</p>
          <h5 className="font-medium">Module Length</h5>
          <p>{data[modelIndex]?.length}</p>
        </div>

        <div className="border-b py-4">
          <p>{data[modelIndex]?.description}</p>
        </div>

        <div className="border-b py-4">
          <h4 className="text-lg font-semibold">Includes</h4>
          <p>BathRoomLayout : </p>
          <p>KitchenLayout :</p>
        </div>

        <div className="py-4">
          <h4 className="text-lg font-semibold mb-4">Upgrade Available</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data[modelIndex]?.upgradesType &&
              data[modelIndex]?.upgradesType.map((upgrade, index) => (
                <fieldset
                  key={index}
                  className="relative p-4 border rounded-lg shadow-sm"
                >
                  <legend className="text-xs font-medium text-gray-700">
                    {upgrade.name}
                  </legend>

                  <div className="flex items-center justify-center ">
                    <div className="border border-purple-300">
                      <img
                        src={upgrade.image}
                        alt={upgrade.name}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  </div>
                  <p className="text-center ">Price : {upgrade.price}</p>
                </fieldset>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectedModelDetails;
