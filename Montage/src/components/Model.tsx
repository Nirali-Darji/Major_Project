import { useLoader } from "@react-three/fiber"
import { observer } from "mobx-react-lite"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import store from "../stores/ConfiguratorStore"
import Model2D from "./Model2D"
import Model3D from "./Model3D"
import { useEffect, useState } from "react"

const Model = observer(({ id, url, position }: { id: string, url: string, position: [number, number, number] }) => {
  const gltf = useLoader(GLTFLoader, url);
  if (gltf && gltf.scene) {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        store.addModelToGroup(id, child);
      }
    });
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
