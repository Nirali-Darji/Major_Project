import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { DropdownMenu } from "./DesignTools";
import store from "../stores/ConfiguratorStore";
import { observer } from "mobx-react-lite";
import { GoHomeFill } from "react-icons/go";


const DesignCard = ({ design, type,modelId, index }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDragStart = (e: React.DragEvent, url: string, id: string) => {
    const payload = JSON.stringify({ url, gltfId: id });
    e.dataTransfer.setData("application/json", payload);
  };

  return (
    <div
      className={`relative w-full h-max mx-2 bg-white rounded-2xl shadow-lg overflow-hidden group hover:border-2 ${
        type === "design" && store.isSelected(modelId)
          ? "border-yellow-500 border-2"
          : "border-black"
      }`}
      onClick={() => {
        if (type === "design") {
          store.selectModel(modelId);
        }
      }}
    >
       {store.baseModel===modelId && type === "design" && (
        <div className="absolute top-3 left-3 bg-transparent p-1">
          <GoHomeFill  size={20} />
        </div>
      )}
      <div
        className="absolute top-3 right-3 text-gray-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => {
          setShowDropdown((prev) => !prev);
        }}
      >
        <BsThreeDotsVertical size={20} />
      </div>
      <div className="absolute top-3 right-3 bg-white  z-999">
      {showDropdown && <DropdownMenu onClose={() => setShowDropdown(false)} />}</div>

      {/* Card Image */}
      <div className="w-[80%] m-auto p-4 flex justify-center items-center ">
        {!isImageLoaded && (
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
        <img
          onLoad={() => setIsImageLoaded(true)}
          src={design?.moduleImage}
          alt="Card Image"
          className="w-[80%] m-auto object-cover p-4"
          draggable={type === "module"}
          onDragStart={(e) => {
            if (type === "module") {
              handleDragStart(e, design.glbFile, design.id);
              store.setViewMode('2D'); 
            }
          }}
        />
      </div>

      {/* Card Content */}
      {type === "module" && (
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {design?.name}
          </h2>
          <div className="text-gray-600 mt-1 flex justify-between text-xs">
            <div>{design?.pricePerSqft}</div>
            <div>{design?.noOfBathrooms} Bathroom</div>
            <div>{design?.noOfBedrooms} Bedroom</div>
            <div>{design?.size} sqft</div>
          </div>
        </div>
      )}

      {type === "design" && (
        <div className="p-4 flex justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {design?.name}
          </h2>
          <p className="text-sm text-gray-500">{index}</p>
        </div>
      )}
    </div>
  );
};

export default observer(DesignCard);
