import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import store from "../stores/ConfiguratorStore";
import CameraSetUp from "../utils/CameraSetUp";
import CanvasDropHandler from "../utils/CanvasDropHandler";
import Model from "./Model";
import { observer } from "mobx-react-lite";

const CanvasSetup = observer(() => {

  return (
    <>
      <CanvasDropHandler />
      <CameraSetUp />
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={1} />
      <directionalLight position={[10, 10, -5]} intensity={1} />

      {store.viewMode === "2D" ? (
        <OrbitControls
          makeDefault
          enableRotate={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      ) : (
        <OrbitControls makeDefault />
      )}

      {store.viewMode === "2D" && (
        <gridHelper
          args={[100, 100, 0xf0f0f0, 0xf0f0f0]}
          position={[0, -2, 0]}
        />
      )}

      {store.models.map((model) => (
        <Model
          key={model.id}
          id={model.id}
          url={model.url}
          position={model.position}
        />
      ))}

    </>
  );
});

export default CanvasSetup;
