import { OrbitControls } from "@react-three/drei";
import store from "../stores/ConfiguratorStore";
import CameraSetUp from "../utils/CameraSetUp";
import CanvasDropHandler from "../utils/CanvasDropHandler";
import Model from "./Model";
import { observer } from "mobx-react-lite";
// import MultiSelectionControls from "../utils/MultiSelectionControls";
import * as THREE from 'three'

const CanvasSetup = observer(() => {
    // const { camera } = useThree();
  
    // // Update camera look-at when view mode changes
    // useEffect(() => {
    //   camera.lookAt(0, 0, 0);
    // }, [store.viewMode, camera]);
  
    return (
      <>
        <CanvasDropHandler/>
        <CameraSetUp />
        <ambientLight intensity={1} />
  <directionalLight position={[10, 10, 5]} intensity={1} />
  <pointLight position={[0, 10, 0]} intensity={0.5} />
  <mesh rotation={[-Math.PI / 2, 0, 0] } position={[0, -2, 0]}>
    <planeGeometry args={[100, 100]}  />
    <meshBasicMaterial   color={new THREE.Color(0xffffff)} />
  </mesh>
  
        {/* Use restricted controls for 2D view */}
        {store.viewMode === '2D' ? (
          <OrbitControls
            makeDefault
            enableRotate={false}
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
          />
        ) : (
          <OrbitControls makeDefault />
        )}
  
        {/* Grid helper for 2D view */}
        {store.viewMode === '2D' && (
          <gridHelper args={[100, 100, 0xf0f0f0, 0xf0f0f0]} position={[0, -2, 0]}  />
        )}
  
        {/* Load all models */}
        {store.models.map((model) => (
          <Model
            key={model.id}
            id={model.id}
            url={model.url}
            position={model.position}
          />
        ))}
  
        {/* Add transform controls for multi-selection */}
        {/* <MultiSelectionControls /> */}
      </>
    );
  });
  

export default CanvasSetup
