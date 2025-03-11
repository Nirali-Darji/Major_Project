import store from "../stores/ConfiguratorStore";
import { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import * as THREE from 'three';

const Model3D = observer(({ id, gltf, position }: { id: string, gltf: any, position: [number, number, number] }) => {
  const ref = useRef<THREE.Group>(null);

  // Debug position
  useEffect(() => {
    if (ref.current) {
      ref.current.position.set(...position);
    }
  }, [position]);

 

  // Add highlight effect for selected models
  useEffect(() => {
    if (gltf && gltf.scene) {
      gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
          if(child.name.includes("Roof")){
            child.material.transparent = true;
            child.material.opacity = 0;
            child.visible = false;
            console.log(child)
          }

          if(child.name.includes("Node")){
            child.material.transparent = true;
            child.material.color.set("cyan");
            child.material.opacity = 0.7;
          }
          
        }
      });
    }

  }, [gltf]);

  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        store.selectModel(id);
      }}
      scale={[1, 1, 1]} // Adjust scale as needed
    >
      
      <primitive object={gltf.scene.clone()} />
      
    </group>
  );
});

export default Model3D;