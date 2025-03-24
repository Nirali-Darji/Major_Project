import { useEffect } from "react";
import store from "../stores/ConfiguratorStore";
import getInterSection from "../utils/getInterSection";
import * as THREE from 'three';


const useDragInteractions = (id:string, gl: THREE.WebGLRenderer, raycaster: THREE.Raycaster, camera: THREE.Camera, mouse: THREE.Vector2, dragPlane: THREE.Plane, intersection: THREE.Vector3) => {
    const onPointerMove = (e) => {
      if (!store.isDragging) return;
      
      const newPoint = getInterSection(dragPlane, intersection, raycaster, camera, mouse, gl, e);
      store.continueDragging(newPoint);
    };
    
    const onPointerUp = () => {
      if (!store.isDragging) return;
      
      store.endDragging();
      gl.domElement.style.cursor = 'auto';
      
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  
    const startDragging = (e) => {
      const clickPoint = getInterSection(dragPlane, intersection, raycaster, camera, mouse, gl, e);
      
      const startedDragging = store.startDragging(id, clickPoint);
      
      if (startedDragging) {
        gl.domElement.style.cursor = 'grabbing';
        
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
      }
  
      return startedDragging;
    };
  
    // Clean up event listeners on unmount
    useEffect(() => {
      return () => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      };
    }, []);
  
    return { startDragging };
  };
  

  export default useDragInteractions;