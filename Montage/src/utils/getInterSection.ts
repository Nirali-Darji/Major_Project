import * as THREE from 'three';

const getInterSection = (dragPlane: THREE.Plane, intersection: THREE.Vector3,raycaster: THREE.Raycaster, camera: THREE.Camera, mouse: THREE.Vector2, gl: THREE.WebGLRenderer, e) =>{

      const currentEvent = e.nativeEvent || e;
    
    if (currentEvent.clientX !== undefined) {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((currentEvent.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((currentEvent.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera({ x, y }, camera);
    } else {
      raycaster.setFromCamera(mouse, camera);
    }
    
    raycaster.ray.intersectPlane(dragPlane, intersection);
    return [intersection.x, intersection.y, intersection.z] as [number, number, number];
}

export default getInterSection;