import { observer } from "mobx-react-lite";
import store from "../stores/ConfiguratorStore";
import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from 'three';
import getInterSection from "./getInterSection";

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
    if(store.viewMode === '2D'){
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();    
          const position: [number, number, number] = getInterSection(dragPlane, intersection, raycaster, camera, mouse, gl, e);
          
          const url = e.dataTransfer?.getData('text/plain');
          if (url) {
              store.addModel(url, position);
          }
        } 
      

    const canvas = gl.domElement;
    canvas.addEventListener('dragover', handleDragOver);
    canvas.addEventListener('drop', handleDrop);
    

    return () => {
      canvas.removeEventListener('dragover', handleDragOver);
      canvas.removeEventListener('drop', handleDrop);
    };}
  }, [gl, camera, raycaster, dragPlane, intersection, mouse]);

  return null;
});

export default CanvasDropHandler;