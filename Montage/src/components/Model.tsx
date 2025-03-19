import { useLoader } from "@react-three/fiber"
import { observer } from "mobx-react-lite"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import store from "../stores/ConfiguratorStore"
import Model2D from "./Model2D"
import Model3D from "./Model3D"
import { useEffect, useState } from "react"
import * as THREE from 'three';


const Model = observer(({ id, url, position }: { id: string, url: string, position: [number, number, number] }) => {
  const gltf = useLoader(GLTFLoader, url);
  if (gltf && gltf.scene) {
    store.addModelToGroup(id, gltf.scene.clone());
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        if (child.name.includes("Node")) {
          const nodeGeometry = child.geometry.clone();
            nodeGeometry.applyMatrix4(child.matrixWorld);

            const nodeBox = new THREE.Box3().setFromBufferAttribute(nodeGeometry.attributes.position);
            const nodeSize = new THREE.Vector3();
            nodeBox.getSize(nodeSize);
            const primaryAxis = nodeSize.x > nodeSize.z ? 'x' : 'z';

            const nodeCenter = new THREE.Vector3();
            nodeBox.getCenter(nodeCenter);

            const startPoint = new THREE.Vector3();
            const endPoint = new THREE.Vector3();
            const directionVector = primaryAxis === 'x' ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 0, 1);
            directionVector.normalize();

            const halfLength = primaryAxis === 'x' ? nodeSize.x / 2 : nodeSize.z / 2;
            startPoint.copy(nodeCenter).sub(directionVector.clone().multiplyScalar(halfLength));
            endPoint.copy(nodeCenter).add(directionVector.clone().multiplyScalar(halfLength));

            store.setNodes(
              id, 
              [startPoint.x, 0, startPoint.z], 
              [endPoint.x, 0, endPoint.z], 
              [nodeCenter.x, 0, nodeCenter.z]
            );
        }
      }
    })
  }

  const [lastSelected2DModelId, setLastSelected2DModelId] = useState("");
  useEffect(() => {
    if (store.viewMode === '3D') {
      if (store.selectedModelId) {
        setLastSelected2DModelId(store.selectedModelId);
      }
      store.selectModel(null);
    } else if (store.viewMode === '2D' && lastSelected2DModelId) {
      store.selectModel(lastSelected2DModelId);
    }
  }, [store.viewMode]);
  
  return store.viewMode === '2D' ? (
    <Model2D id={id} gltf={gltf} />
  ) : (
    <Model3D id={id} gltf={gltf} position={position} />
  )
})
export default Model
