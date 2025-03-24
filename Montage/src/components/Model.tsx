import { useLoader } from "@react-three/fiber";
import { observer } from "mobx-react-lite";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import store from "../stores/ConfiguratorStore";
import Model2D from "./Model2D";
import Model3D from "./Model3D";
import { useEffect, useState } from "react";
import * as THREE from "three";

const Model = observer(
  ({
    id,
    url,
    position,
  }: {
    id: string;
    url: string;
    position: [number, number, number];
  }) => {
    
    const gltf = useLoader(GLTFLoader, url);
    useEffect(() => {
      if (gltf && gltf.scene && !store.nodes.some(node => node.modelId === id)) {
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            store.addModelToGroup(id, child);
            if (child.name.includes("Node")) {
              const nodeGeometry = child.geometry.clone();
              nodeGeometry.applyMatrix4(child.matrixWorld);
            
              const nodeBox = new THREE.Box3().setFromBufferAttribute(
                nodeGeometry.attributes.position
              );
              const nodeSize = new THREE.Vector3();
              nodeBox.getSize(nodeSize);
              let primaryAxis = nodeSize.x > nodeSize.z ? "x" : "z"; 
            
              const nodeCenter = new THREE.Vector3();
              nodeBox.getCenter(nodeCenter);
              const model = store.models.find((m) => m.id === id);
              if (!model) return;
            
              const modelBox = store.getModelBoundingBox(model);
              const modelSize = new THREE.Vector3();
              modelBox.getSize(modelSize);
            
              const perpendicularAxis = primaryAxis === "x" ? "z" : "x";
              const boundaryCenter = new THREE.Vector3().copy(nodeCenter);
            
              if (perpendicularAxis === "x") {
                boundaryCenter.x = nodeCenter.x > 0 ? modelSize.x / 2 : -modelSize.x / 2;
              } else {
                boundaryCenter.z = nodeCenter.z > 0 ? modelSize.z / 2 : -modelSize.z / 2;
              }
            
              let directionVector = new THREE.Vector3(
                primaryAxis === "x" ? 1 : 0,
                0,
                primaryAxis === "z" ? 1 : 0
              );
              const halfLength = primaryAxis === "x" ? nodeSize.x / 2 : nodeSize.z / 2;
            
              const startPoint = new THREE.Vector3();
              const endPoint = new THREE.Vector3();
              startPoint.copy(boundaryCenter).sub(directionVector.clone().multiplyScalar(halfLength));
              endPoint.copy(boundaryCenter).add(directionVector.clone().multiplyScalar(halfLength));
            
              startPoint.multiply(new THREE.Vector3(model.scale[0], model.scale[1], model.scale[2]));
              endPoint.multiply(new THREE.Vector3(model.scale[0], model.scale[1], model.scale[2]));
              boundaryCenter.multiply(new THREE.Vector3(model.scale[0], model.scale[1], model.scale[2]));

              const rotationMatrix = new THREE.Matrix4().makeRotationFromQuaternion(
                new THREE.Quaternion().setFromEuler(
                  new THREE.Euler(...model.rotation)
                )
              );
            
              startPoint.applyMatrix4(rotationMatrix);
              endPoint.applyMatrix4(rotationMatrix);
              boundaryCenter.applyMatrix4(rotationMatrix);
              directionVector.applyMatrix4(rotationMatrix);
            
              if (Math.abs(directionVector.x) > Math.abs(directionVector.z)) {
                primaryAxis = "x";
              } else {
                primaryAxis = "z";
              }
            
              store.setNodes(
                id,
                [startPoint.x, 0, startPoint.z],
                [endPoint.x, 0, endPoint.z],
                [boundaryCenter.x, 0, boundaryCenter.z],
                primaryAxis
              );
            }
            
          }
        });
      }
    }, []);
    
    const [lastSelected2DModelId, setLastSelected2DModelId] = useState("");
    useEffect(() => {
      if (store.viewMode === "3D") {
        if (store.selectedModelId) {
          setLastSelected2DModelId(store.selectedModelId);
        }
        store.selectModel(null);
      } else if (store.viewMode === "2D" && lastSelected2DModelId) {
        store.selectModel(lastSelected2DModelId);
      }
    }, [store.viewMode]);

    return store.viewMode === "2D" ? (
      <Model2D id={id} gltf={gltf} />
    ) : (
      <Model3D id={id} gltf={gltf} position={position} />
    );
  }
);
export default Model;
