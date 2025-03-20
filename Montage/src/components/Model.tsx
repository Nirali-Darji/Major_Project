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
        store.addModelToGroup(id, gltf.scene.clone());
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            if (child.name.includes("Node")) {
              const nodeGeometry = child.geometry.clone();
              nodeGeometry.applyMatrix4(child.matrixWorld);
    
              const nodeBox = new THREE.Box3().setFromBufferAttribute(
                nodeGeometry.attributes.position
              );
              const nodeSize = new THREE.Vector3();
              nodeBox.getSize(nodeSize);
              const primaryAxis = nodeSize.x > nodeSize.z ? "x" : "z";
    
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
                boundaryCenter.x = nodeCenter.x > 0 
                  ? modelSize.x / 2 
                  : -modelSize.x / 2;
              } else {
                boundaryCenter.z = nodeCenter.z > 0 
                  ? modelSize.z / 2 
                  : -modelSize.z / 2;
              }
    
              const directionVector =
                primaryAxis === "x"
                  ? new THREE.Vector3(1, 0, 0)
                  : new THREE.Vector3(0, 0, 1);
              const halfLength =
                primaryAxis === "x" ? nodeSize.x / 2 : nodeSize.z / 2;
    
              const startPoint = new THREE.Vector3();
              const endPoint = new THREE.Vector3();
              startPoint
                .copy(boundaryCenter)
                .sub(directionVector.clone().multiplyScalar(halfLength));
              endPoint
                .copy(boundaryCenter)
                .add(directionVector.clone().multiplyScalar(halfLength));
    
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
