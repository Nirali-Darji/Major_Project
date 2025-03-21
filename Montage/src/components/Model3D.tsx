import store from "../stores/ConfiguratorStore";
import { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import * as THREE from 'three';

const Model3D = observer(({ id, gltf, position }: { id: string, gltf: any, position: [number, number, number] }) => {
  const ref = useRef<THREE.Group>(null);
  const planeRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (gltf && gltf.scene) {
      gltf.scene.traverse((child: any) => {
        child.castShadow = true;
          child.receiveShadow = true;
          if(child.name.includes("Roof") || child.name.includes("Ceiling")){
            child.visible = false;
            return;
          }
          if(child.name.includes("Node") && child.isMesh){
            child.material.transparent = true;
            child.material.color.set("cyan");
            child.material.opacity = 0.7;
            return;
          }
         child.raycast =() =>{} 
        
      });
    }
  }, [gltf]);

  return (
    <>
      
      {/* 3D Model */}
      <group
        ref={ref}
        position={position}
        rotation-y={store.getModelRotation(id)}
        scale={store.getModelScale(id)} 
      >
        <primitive object={gltf.scene.clone()} />
      </group>
    </>
  );
});

export default Model3D;