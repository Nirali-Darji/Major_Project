import store from "../stores/ConfiguratorStore";
import { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import * as THREE from 'three';

const Model3D = observer(({ id, gltf, position }: { id: string, gltf: any, position: [number, number, number] }) => {
  const ref = useRef<THREE.Group>(null);

  useEffect(() => {
    if (gltf && gltf.scene) {
      gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
          if(child.name.includes("Roof")){
            child.material.transparent = true;
            child.material.opacity = 0;
            child.visible = false;
          }

          if(child.name.includes("Node")){
            child.material.transparent = true;
            child.material.color.set("cyan");
            child.material.opacity = 0.7;
          }
         child.raycast =() =>{} 
        }
      });
    }



  }, [gltf]);

  return (
    <group
      ref={ref}
      position={position}
      rotation-y={store.getModelRotation(id)}
      scale={[1, 1, 1]} 
    >
      
      <primitive object={gltf.scene.clone()} />
      
    </group>
  );
});

export default Model3D;