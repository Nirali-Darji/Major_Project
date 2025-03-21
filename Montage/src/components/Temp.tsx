import { Canvas, useThree } from "@react-three/fiber";
import CanvasSetup from "./CanvasSetup";
import store from "../stores/ConfiguratorStore";
import ViewModeToggle from "./ViewModeToggle";
import SelectionBar from "./SelectionBar";
import { observer } from "mobx-react-lite";
import * as THREE from "three";
import { Html } from "@react-three/drei";

export const ScreenshotButton = () => {
  const { gl, scene, camera } = useThree();

  const takeSnapShot = () => {
    const htmlElements = document.querySelectorAll("canvas");
    const originalVisibility: boolean[] = [];

    const originalClearColor = new THREE.Color();
    gl.getClearColor(originalClearColor);
    const originalClearAlpha = gl.getClearAlpha();
    gl.setClearColor("white", 1);

    htmlElements.forEach((el, index) => {
      originalVisibility[index] = el.classList.contains("visible");
      el.classList.remove("visible");
      el.classList.add("hidden");
    });

    gl.render(scene, camera);

    const dataUrl = gl.domElement.toDataURL("image/png");

    htmlElements.forEach((el, index) => {
      el.classList.remove("hidden");
      if (originalVisibility[index]) {
        el.classList.add("visible");
      }
    });

    gl.setClearColor(originalClearColor, originalClearAlpha);
    gl.render(scene, camera);

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "screenshot.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Html>
      <button onClick={takeSnapShot}>Take Screenshot</button>
    </Html>
  );
};

const Temp = observer(() => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 p-6 bg-white border-r border-gray-200 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">3D Configurator</h2>
        <ViewModeToggle />
        <SelectionBar />
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Models ({store.models.length})
            </h3>
          </div>
          <ul>
            {store.models.map((model) => (
              <li
                key={model.id}
                className={`p-2 mb-2 flex justify-between items-center rounded-md cursor-pointer ${
                  store.isSelected(model.id) ? "bg-blue-50" : "bg-gray-50"
                }`}
                onClick={() => store.selectModel(model.id)}
              >
                <span>Model {model.id.substring(0, 4)}</span>
                <button
                  className="px-2 py-1 text-sm text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    store.removeModel(model.id);
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* <ScreenshotButton /> */}
      </div>

      {/* Canvas Container */}
      <div className="flex-1">
        <Canvas>
          <CanvasSetup />
        </Canvas>
      </div>
    </div>
  );
});

export default Temp;
