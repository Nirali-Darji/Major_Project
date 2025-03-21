import { CameraControls, OrbitControls } from "@react-three/drei";
import store from "../stores/ConfiguratorStore";
import CameraSetUp from "../utils/CameraSetUp";
import CanvasDropHandler from "../utils/CanvasDropHandler";
import Model from "./Model";
import { observer } from "mobx-react-lite";
import * as THREE from "three";
import { Canvas, extend } from "@react-three/fiber";


extend({ THREE });
const CanvasSetup = observer(() => {

  return (
    <>
      <Canvas
      shadows
      gl={{
        antialias: true,
        shadowMap: {
          enabled: true,
          type: THREE.PCFSoftShadowMap
        }
      }}
      camera={{ position: [0, 5, 10], fov: 45 }}
    >
      <CanvasDropHandler />
      <CameraSetUp />
      
      {/* Lighting with shadows */}
      <ambientLight intensity={3} />
      
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      <directionalLight position={[-10, -10, -5]} intensity={2} />
      <directionalLight position={[10, 10, -5]} intensity={2} />

      {/* Floor plane to receive shadows */}
    

      {store.viewMode === "2D" ? (
            <OrbitControls
            makeDefault
            enableRotate={false}
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2} 
            minDistance={1}
            maxDistance={100}
          />
      ) : (
        <CameraControls
        makeDefault
        draggingSmoothTime={0.05}
        draggingDampingFactor={0.02}
        rotateSpeed={0.5}
        zoomSpeed={2.5}
        truckSpeed={1}
        enabled={true}
      />
      )}

      {store.viewMode === "2D" ? (
        <gridHelper
          args={[100, 100, 0xf0f0f0, 0xf0f0f0]}
          position={[0, -2, 0]}
        />
      ) : (
        <mesh 
        rotation={[-Math.PI*0.5, 0, 0]} 
        position={[0, -2.01, 0]} 
        receiveShadow
        >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#ffffff" 
          roughness={0.8}
          metalness={0.2}
          />
      </mesh>
      )}

      {store.models.map((model) => (
        <Model
          key={model.id}
          id={model.id}
          url={model.url}
          position={model.position}
        />
      ))}

      
    </Canvas>
    </>
  );
});

export default CanvasSetup;
