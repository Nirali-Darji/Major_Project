import { useMemo } from 'react';
import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/Addons.js';
import store from '../stores/ConfiguratorStore';


const useMergeGeometry = (gltf, id, modelCenter) => {
  const scale = store.getModelScale(id);

  const { geometry } = useMemo(() => {
    const geometries = [];

    if (gltf && gltf.scene) {
    gltf.scene.updateMatrixWorld(true);

    gltf.scene.traverse((child) => {
      if (child.name.includes("Roof") || child.name.includes("Ceiling")) return;
        if (child.isMesh) {
          store.addModelToGroup(id, child);

          const geometryForMerge = child.geometry.clone();
          geometryForMerge.applyMatrix4(child.matrixWorld); 

          if (!geometryForMerge.attributes.uv) {
            const uvs = new Float32Array(geometryForMerge.attributes.position.count * 2);
            geometryForMerge.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
          }

          
          const colors = new Float32Array(geometryForMerge.attributes.position.count * 3);
          const color = new THREE.Color();

          if (child.name.includes("Node")) {
            color.set("cyan");

          } else if (child.name.includes("Floor")) {
            color.set("#f0f0f0");
          } else {
            color.set("#ffffff");
          }

          for (let i = 0; i < colors.length; i += 3) {
            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
          }

          geometryForMerge.setAttribute('color', new THREE.BufferAttribute(colors, 3));
          geometries.push(geometryForMerge);
        }
      });
    }

    let mergedGeometry = null;
    if (geometries.length > 0) {
      try {
        mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
      } catch (error) {
        console.error("Failed to merge geometries:", error);
      }
    }

    return { geometry: mergedGeometry };
  }, [gltf, id, scale]);
 
  return { geometry };
};

export default useMergeGeometry;
