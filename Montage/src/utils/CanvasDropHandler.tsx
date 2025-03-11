import { observer } from "mobx-react-lite";
import store from "../stores/ConfiguratorStore";
import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from 'three';

const CanvasDropHandler = observer(() => {
  const { camera, gl } = useThree();
  
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  
  const dragPlane = useMemo(() => {
    const plane = new THREE.Plane();
    plane.setFromNormalAndCoplanarPoint(
      new THREE.Vector3(0, 1, 0),  
      new THREE.Vector3(0, -2, 0)  
    );
    return plane;
  }, []);
  
  const intersection = useMemo(() => new THREE.Vector3(), []);
  const mouse = useMemo(() => new THREE.Vector2(), []);

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();

      if (e.clientX !== undefined) {
        const rect = gl.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        
        
        raycaster.setFromCamera(mouse, camera);
        
     
        const didIntersect = raycaster.ray.intersectPlane(dragPlane, intersection);
        
        if (didIntersect) {
          
          const position: [number, number, number] = [
            intersection.x,
            intersection.y,
            intersection.z
          ];
          
          const url = e.dataTransfer?.getData('text/plain');
          console.log(url)
          if (url) {
              store.addModel(url, position);
          }
        } 
      }
    };

    const canvas = gl.domElement;
    canvas.addEventListener('dragover', handleDragOver);
    canvas.addEventListener('drop', handleDrop);
    

    return () => {
      canvas.removeEventListener('dragover', handleDragOver);
      canvas.removeEventListener('drop', handleDrop);
    };
  }, [gl, camera, raycaster, dragPlane, intersection, mouse]);

  return null;
});

export default CanvasDropHandler;