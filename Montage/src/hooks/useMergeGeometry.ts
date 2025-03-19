import { useMemo } from 'react';
import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/Addons.js';
import store from '../stores/ConfiguratorStore';

const useMergeGeometry = (gltf, id, modelCenter) => {
  const scale = store.getModelScale(id);

  const { geometry, nodeEndpoints } = useMemo(() => {
    const geometries = [];
    const endpoints = [];

    if (gltf && gltf.scene) {
    gltf.scene.updateMatrixWorld(true);

      
    const modelPosition = new THREE.Vector3().copy(gltf.scene.position);

    gltf.scene.traverse((child) => {
        if (child.isMesh) {
          store.addModelToGroup(id, child);
          if (child.name.includes("Roof")) return;

          const geometryForMerge = child.geometry.clone();
          geometryForMerge.applyMatrix4(child.matrixWorld); // Apply world transformation

          if (!geometryForMerge.attributes.uv) {
            const uvs = new Float32Array(geometryForMerge.attributes.position.count * 2);
            geometryForMerge.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
          }

          // Set colors
          const colors = new Float32Array(geometryForMerge.attributes.position.count * 3);
          const color = new THREE.Color();

          if (child.name.includes("Node")) {
            color.set("cyan");

            const nodeGeometry = child.geometry.clone();
            nodeGeometry.applyMatrix4(child.matrixWorld);

            const nodeBox = new THREE.Box3().setFromBufferAttribute(nodeGeometry.attributes.position);
            const nodeSize = new THREE.Vector3();
            nodeBox.getSize(nodeSize);
            const primaryAxis = nodeSize.x > nodeSize.z ? 'x' : 'z';

            const nodeCenter = new THREE.Vector3();
            nodeBox.getCenter(nodeCenter);
            const modelToNodeVector = new THREE.Vector3().subVectors(nodeCenter, modelCenter);

            const startPoint = new THREE.Vector3();
            const endPoint = new THREE.Vector3();
            const directionVector = primaryAxis === 'x' ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 0, 1);
            directionVector.normalize();

            const halfLength = primaryAxis === 'x' ? nodeSize.x / 2 : nodeSize.z / 2;
            startPoint.copy(nodeCenter).sub(directionVector.clone().multiplyScalar(halfLength));
            endPoint.copy(nodeCenter).add(directionVector.clone().multiplyScalar(halfLength));

            // store.setNodes(
            //   id, 
            //   [startPoint.x, 0, startPoint.z], 
            //   [endPoint.x, 0, endPoint.z], 
            //   [nodeCenter.x, 0, nodeCenter.z]
            // );

            endpoints.push({
              nodeName: child.name,
              start: { x: startPoint.x, z: startPoint.z },
              end: { x: endPoint.x, z: endPoint.z },
              center: { x: nodeCenter.x, z: nodeCenter.z },
              modelPosition: { x: modelPosition.x, z: modelPosition.z },
              modelToNode: { x: modelToNodeVector.x, z: modelToNodeVector.z }
            });
          } else if (child.name.includes("Floor")) {
            color.set("#fefefe");
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

    return { geometry: mergedGeometry, nodeEndpoints: endpoints };
  }, [gltf, id, scale]);

  return { geometry, nodeEndpoints };
};

export default useMergeGeometry;
