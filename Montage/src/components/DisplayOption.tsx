import React, { useState } from "react";
import { GiMeshNetwork } from "react-icons/gi";
import { IoCubeOutline } from "react-icons/io5";
import { PiImageSquare } from "react-icons/pi";
import store from "../stores/ConfiguratorStore";


function DisplayOption() {
  const [selected, setSelected] = useState<string | null>(null);

  const buttons = [
    { id: '2D', icon: <GiMeshNetwork size={20} /> },
    { id: '3D', icon: <IoCubeOutline size={20} /> },
    { id: 'images', icon: <PiImageSquare size={20} /> },
  ];

  return (
    <div>
      <div className="flex gap-2 items-center bg-gray-100 p-2 fixed top-30 right-90 rounded-lg z-10">
        {buttons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => {setSelected(btn.id)
              if (btn.id === '2D' || btn.id === '3D' || btn.id === 'images') {
                store.setViewMode(btn.id);
              }
            }}
            className={`p-1 rounded-lg transition-all duration-200 hover:bg-gray-300 ${
              selected === btn.id
                ? "border-2 border-blue-500"
                : "border-2 border-transparent"
            }`}
          >
            {btn.icon}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DisplayOption;
