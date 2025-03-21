import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import DesignLeftBar from "./DesignLeftBar";
import DesignRightBar from "./DesignRightBar";
import DisplayOption from "./DisplayOption";
import CanvasSetup from "./CanvasSetup";
import { observer } from "mobx-react-lite";
import store from "../stores/ConfiguratorStore";
import SelectedModelDetails from "./SelectedModelDetails";
import { ScreenshotButton } from "./Temp";
import DesignNavBar from "./DesignNavbar";

function DesignModel() {
  const [showRightBar, setShowRightBar] = useState(true);

  return (
    <div className="h-screen w-screen">
      <div className="flex-1 fixed top-0 left-0 w-full h-full z-0">
        <Canvas>
          <CanvasSetup />
        <ScreenshotButton />

        </Canvas>
      </div>

      {/* UI Components */}
      <div className="relative z-10 ">
        <div className="absolute fixed left-0 top-0 z-20 w-full">
          <DesignNavBar />
        </div>
        {/* <div className="flex justify-between"> */}
        <div className="absolute fixed left-0 top-17  z-20">
          <DesignLeftBar />
        </div>
        <DisplayOption />
        <div className="flex-grow">
          <div className="p-4"></div>
        </div>
        {/* {showRightBar &&  (
            <div className="absolute fixed right-0 top-16 z-20">
              <DesignRightBar />
            </div>
          )}  */}
        <div
          className={`absolute fixed right-0 top-17 z-20 transition-all duration-300 ${
            showRightBar ? "w-90" : "w-0 overflow-hidden"
          }`}
        >
          <DesignRightBar />
        </div>
        {showRightBar && store.showDetails && (
          <SelectedModelDetails
            isVisible={true}
            onClose={() => store.setShowDetails(false)}
          />
        )}
        {/* </div> */}
      </div>

      {/* Toggle Right Bar Button */}
      <div
        className={`fixed bottom-4 ${
          showRightBar ? "right-95" : "right-10"
        } z-30`}
      >
        <button
          onClick={() => setShowRightBar((prev) => !prev)}
          className="bg-green-500 text-white p-2 rounded-full"
        >
          {showRightBar ? (
            <FaArrowRight size={15} />
          ) : (
            <FaArrowLeft size={15} />
          )}
        </button>
      </div>
    </div>
  );
}

export default observer(DesignModel);
