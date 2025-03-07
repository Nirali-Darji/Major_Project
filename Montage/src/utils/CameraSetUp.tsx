import { useThree } from "@react-three/fiber"
import { observer } from "mobx-react-lite"
import store from "../stores/ConfiguratorStore"
import { OrthographicCamera, PerspectiveCamera } from "@react-three/drei"

const CameraSetUp = observer(() => {
    // Get scene dimensions for setting up orthographic camera
    const { viewport } = useThree()
    const aspect = viewport.width / viewport.height
    
    // Orthographic camera parameters
    const orthoZoom = 30
    const orthoNear = 0.1
    const orthoFar = 1000
  
    const perspectiveFov = 45; // Field of view
    const perspectiveNear = 0.1;
    const perspectiveFar = 1000;
    
    return (
      <>
        {store.viewMode === '3D' ? (
          <PerspectiveCamera  makeDefault
          fov={perspectiveFov}
          near={perspectiveNear}
          far={perspectiveFar} position={[0, 0, 5]} />
        ) : (
          <OrthographicCamera
            makeDefault
            position={[0, 10, 0]}
            zoom={3}
            near={orthoNear}
            far={orthoFar}
            left={-aspect * orthoZoom}
            right={aspect * orthoZoom}
            top= {orthoZoom}
            bottom={-orthoZoom}
            up={[0, 0, -1]} // Adjust up vector for top-down view
          />
        )}
      </>
    )
  })

export default CameraSetUp
