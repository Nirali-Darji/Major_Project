import React from "react";
import { useState } from "react";
// import { Canvas } from "@react-three/fiber";
import { GoHome, GoHomeFill } from "react-icons/go";
import { LuFlipHorizontal, LuFlipVertical } from "react-icons/lu";
import { MdContentCopy, MdDelete, MdLockOutline } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { observer } from "mobx-react-lite";
// import { useState } from "react";
import { Html } from "@react-three/drei";
import store from "../stores/ConfiguratorStore";
import SelectedModelDetails from "./SelectedModelDetails";
import { div } from "three/tsl";

function DesignTools({ mirrorHorizontal, mirrorVertical }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const id = store.selectedModelId;

  return (
    <Html>
      <div className="flex space-x-2 p-2 absolute -top-40 -left-30 bg-white rounded-lg shadow-lg ">
        <button
          className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => {
            store.setBaseModel(id);
          }}
        >
          {store.baseModel === id ? (
            <GoHomeFill size={20} />
          ) : (
            <GoHome size={20} />
          )}
        </button>
        <button
          className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={mirrorHorizontal}
        >
          <LuFlipHorizontal size={20} />
        </button>
        <button
          className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={mirrorVertical}
        >
          <LuFlipVertical size={20} />
        </button>
        <button
          className="p-2 bg-red-200 rounded hover:bg-red-300"
          onClick={() => store.removeModel(id)}
        >
          <MdDeleteOutline size={20} />
        </button>
        <button
          className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          <BsThreeDots size={20} />
        </button>
        {/* Render dropdown if visible */}
        {showDropdown && (

<div  className="absolute top-0 left-full ml-4 z-[9999] w-55 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
          <DropdownMenu onClose={() => setShowDropdown(false)} className ="absolute top-0 left-full" /></div>
        )}
      </div>
    </Html>
  );
}

export default observer(DesignTools);

export function DropdownMenu({ onClose }) {
  //   const [isLock, setIsLock] = useState(false);
  // const [showDetails, setShowDetails] = useState(false);
  const id = store.selectedModelId;
  const modelDetails = getModelDetails(id);
  const positions = store.getModelPosition(id);
  console.log(positions);

  return (
    <div>
      <button
        className="text-sm font-medium text-gray-500 mb-3"
        onClick={() => store.setShowDetails(true)}
      >
        View Module Details
      </button>

      <div className="space-y-3">
        <button
          className="flex items-center justify-between w-full p-2 hover:bg-gray-100 rounded-lg"
          onClick={() =>
            store.addModel(modelDetails?.url, [positions[0] +1, positions[1], positions[2]+1], modelDetails?.gltfId)
          }
        >
          <div className="flex items-center space-x-2">
            <MdContentCopy size={20} className="text-gray-600" />
            <span className="text-gray-700">Duplicate</span>
          </div>
          <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
            Ctrl+D
          </span>
        </button>

        <button
          className="flex items-center justify-between w-full p-2 hover:bg-red-100 rounded-lg"
          onClick={() => store.removeModel(id)}
        >
          <div className="flex items-center space-x-2">
            <MdDelete size={20} className="text-red-600" />
            <span className="text-red-600">Delete</span>
          </div>
          <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
            Delete
          </span>
        </button>

        <button
          className="flex items-center justify-between w-full p-2 hover:bg-gray-100 rounded-lg"
          onClick={() => alert("Lock Model")}
        >
          <div className="flex items-center space-x-2">
            <MdLockOutline size={20} className="text-gray-600" />
            <span className="text-gray-700">Lock</span>
          </div>
          <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
            Ctrl+Alt+L
          </span>
        </button>
      </div>

      <button
        className="block w-full mt-4 px-4 py-2 text-center text-gray-500 hover:bg-gray-100 rounded-lg"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
}
export const getModelDetails = (id) => {
  const model = store.models.find((model) => model.id === id);
  if (model) {
    return { url: model.url, gltfId: model.gltfId };
  } else {
    console.warn("Model not found!");
    return null;
  }
};
