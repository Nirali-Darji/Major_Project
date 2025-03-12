import { useEffect, useState } from "react";
import * as THREE from 'three';


const useBoundingBox = (groupRef, mergedGeometry, isSelected, isHovered, position, setModelCenter) => {
    const [boundingBoxInfo, setBoundingBoxInfo] = useState(null);
  
    const cleanupBoundingBox = () => {
      if (boundingBoxInfo && groupRef.current) {
        if (boundingBoxInfo.circles) {
          boundingBoxInfo.circles.forEach(circle => {
            groupRef.current.remove(circle);
            circle.geometry.dispose();
            circle.material.dispose();
          });
        }
        
        if (boundingBoxInfo.lines) {
          boundingBoxInfo.lines.forEach(line => {
            groupRef.current.remove(line);
            line.geometry.dispose();
            line.material.dispose();
          });
        }
      }
    };
  
    useEffect(() => {
      cleanupBoundingBox();
      
      if (!groupRef.current || !mergedGeometry) {
        setBoundingBoxInfo(null);
        return;
      }
      if (!isSelected && !isHovered) {
        setBoundingBoxInfo(null);
        return;
      }
  
      const boundingBox = new THREE.Box3().setFromObject(groupRef.current);
      
      const min = boundingBox.min.clone();
      const max = boundingBox.max.clone();
      
      min.sub(new THREE.Vector3(position[0], position[1], position[2]));
      max.sub(new THREE.Vector3(position[0], position[1], position[2]));
      
      const yPos = 6;
      
      const corners = [
        new THREE.Vector3(min.x, yPos, min.z), // bottom-left
        new THREE.Vector3(max.x, yPos, min.z), // bottom-right
        new THREE.Vector3(max.x, yPos, max.z), // top-right
        new THREE.Vector3(min.x, yPos, max.z), // top-left
      ];
      
      // Calculate and store model center (important for rotation)
      const center = new THREE.Vector3(
        (min.x + max.x) / 2,
        yPos,
        (min.z + max.z) / 2
      );
      setModelCenter(center);
      
      const circleColor = "#c59d1d";
      const lineMaterial = new THREE.LineBasicMaterial({ color: circleColor, linewidth: 5 });
      const lines = [];
      
      // Create 4 lines for the rectangle
      for (let i = 0; i < 4; i++) {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          corners[i],
          corners[(i + 1) % 4] // Connect to next corner, wrapping around to first
        ]);
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        groupRef.current.add(line);
        lines.push(line);
      }
      
      // Only add corner circles if the model is selected (not on hover or by default)
      const circles = [];
      if (isSelected) {
        const circleMaterial = new THREE.MeshBasicMaterial({ 
          color: circleColor,
          transparent: true,
          opacity: 0.8
        });
        const circleRadius = 0.15;
        const circleSegments = 16;
        const circleGeometry = new THREE.CircleGeometry(circleRadius, circleSegments);
        
        corners.forEach((position, index) => {
          const circle = new THREE.Mesh(circleGeometry, circleMaterial.clone());
          circle.position.copy(position);
          circle.rotation.x = -Math.PI / 2;
          
          circle.userData = { 
            isCornerSphere: true,
            cornerIndex: index
          };
          
          groupRef.current.add(circle);
          circles.push(circle);
        });
      }
      
      setBoundingBoxInfo({
        boundingBox,
        min,
        max,
        circles,
        lines
      });
      
    }, [ isSelected, isHovered, mergedGeometry, position, setModelCenter]);
  
    useEffect(() => {
        return () => {
          cleanupBoundingBox();
        };
      }, []);
    
      return { boundingBoxInfo, cleanupBoundingBox };
    };
    
    export default useBoundingBox;    