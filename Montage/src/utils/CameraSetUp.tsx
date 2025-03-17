import { useThree } from "@react-three/fiber"
import { observer } from "mobx-react-lite"
import store from "../stores/ConfiguratorStore"
import { OrthographicCamera, PerspectiveCamera } from "@react-three/drei"

const CameraSetUp = observer(() => {
    const { viewport } = useThree()
    const aspect = viewport.width / viewport.height
    
    const orthoZoom = 10
    const orthoNear = 0.1
    const orthoFar = 1000
  
    const perspectiveFov = 45;
    const perspectiveNear = 0.1;
    const perspectiveFar = 1000;
    
    return (
      <>
        {store.viewMode === '3D' ? (
          <PerspectiveCamera  makeDefault
          fov={perspectiveFov}
          near={perspectiveNear}
          far={perspectiveFar} position={[0, 25, 0]} />
        ) : (
          <OrthographicCamera
            makeDefault
            position={[0, 5, 0]}
            zoom={1}
            near={orthoNear}
            far={orthoFar}
            left={-aspect * orthoZoom}
            right={aspect * orthoZoom}
            top= {orthoZoom}
            bottom={-orthoZoom}
            up={[0, 0, -1]} 
          />
        )}
      </>
    )
  })

export default CameraSetUp
