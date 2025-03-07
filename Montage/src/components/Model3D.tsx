import { Html } from "@react-three/drei";
import store from "../stores/ConfiguratorStore";
import { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import * as THREE from 'three';

const Model3D = observer(({ id, gltf, position }: { id: string, gltf: any, position: [number, number, number] }) => {
  const ref = useRef<THREE.Group>(null);
  const isSelected = store.isSelected(id);

  // Debug position
  useEffect(() => {
    if (ref.current) {
      ref.current.position.set(...position);
      console.log(`Model ${id} position:`, ref.current.position);
    }
  }, [position]);

  // Debug GLTF loading
  useEffect(() => {
    console.log(`Model ${id} GLTF data:`, gltf);
  }, [gltf]);

  // Add highlight effect for selected models
  useEffect(() => {
    if (gltf && gltf.scene) {
      gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
          console.log(`Model ${id} child mesh:`, child);
          if (isSelected) {
            if (!child.originalMaterial) {
              child.originalMaterial = child.material;
            }
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(0x0066ff),
              emissive: new THREE.Color(0x0033cc),
              emissiveIntensity: 0.2,
              metalness: 0.8,
              roughness: 0.2,
            });
          } else if (child.originalMaterial) {
            child.material = child.originalMaterial;
            child.originalMaterial = null;
          }
        }
      });
    }
  }, [gltf, isSelected]);

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
      {isSelected && (
        <Html>
          <div style={{ 
            position: 'absolute', 
            top: '-20px', 
            backgroundColor: 'rgba(0,0,0,0.7)', 
            color: 'white',
            padding: '2px 5px',
            borderRadius: '3px',
            fontSize: '10px'
          }}>
            {id.substring(0, 4)}
          </div>
        </Html>
      )}
    </group>
  );
});

export default Model3D;