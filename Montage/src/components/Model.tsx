import { useLoader } from "@react-three/fiber"
import { observer } from "mobx-react-lite"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import store from "../stores/ConfiguratorStore"
import Model2D from "./Model2D"
import Model3D from "./Model3D"

const Model = observer(({ id, url, position }: { id: string, url: string, position: [number, number, number] }) => {
  const gltf = useLoader(GLTFLoader, url)
  
  return store.viewMode === '2D' ? (
    <Model2D id={id} gltf={gltf} position={position} />
  ) : (
    <Model3D id={id} gltf={gltf} position={position} />
  )
})
export default Model
