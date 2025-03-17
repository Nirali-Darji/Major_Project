import { useMemo } from 'react';
import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/Addons.js';
import store from '../stores/ConfiguratorStore';


const useMergeGeometry = (gltf, id) => {
    return useMemo(() => {
      const geometries = [];
  
      if (gltf && gltf.scene) {
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            store.addModelToGroup(id, child);
            if (child.name.includes("Roof")) {
              return;
            }

            
            const geometry = child.geometry.clone();
            geometry.applyMatrix4(child.matrixWorld);
  
            if (!geometry.attributes.uv) {
              const uvs = new Float32Array(geometry.attributes.position.count * 2);
              geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
            }
  
            const colors = new Float32Array(geometry.attributes.position.count * 3);
            const color = new THREE.Color();
  
            if (child.name.includes("Node")) {
              color.set("cyan");
            } else if(child.name.includes("Floor")){
              color.set("#fefefe");
            } else {
              color.set(new THREE.Color("#ffffff"));
            }
  
            for (let i = 0; i < colors.length; i += 3) {
              colors[i] = color.r;
              colors[i + 1] = color.g;
              colors[i + 2] = color.b;
            }
  
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometries.push(geometry);
          }
        });
      }
  
      // Merge all geometries into one
      if (geometries.length > 0) {
        try {
          return BufferGeometryUtils.mergeGeometries(geometries);
        } catch (error) {
          console.error("Failed to merge geometries:", error);
          return null;
        }
      }
  
      return null;
    }, [gltf, id]);

};

export default useMergeGeometry;