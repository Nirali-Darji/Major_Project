import { Html, Edges } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import store from "../stores/ConfiguratorStore.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import * as THREE from 'three';
import useDragInteractions from "../hooks/useDragInteraction.js";
import useMergeGeometry from "../hooks/useMergeGeometry.js";
import useRotationInteraction from "../hooks/useRotationInteraction.js";

const Model2D = observer(({ id, gltf }: { id: string, gltf: any }) => {
  const groupRef = useRef<THREE.Group>(null);
  const isSelected = store.isSelected(id);
  const isDragging = store.isBeingDragged(id);
  const position = store.geModelPosition(id);
  const rotation = store.getModelRotation(id);
  const [isHovered, setIsHovered] = useState(false);
  const { camera, raycaster, mouse, gl } = useThree();
  const [boundingBoxInfo, setBoundingBoxInfo] = useState(null);
  const [modelCenter, setModelCenter] = useState(new THREE.Vector3(position[0], position[1], position[2]));
 
  
  // Create the drag plane for pointer interactions
  const dragPlane = useMemo(() => {
    const plane = new THREE.Plane();
    plane.setFromNormalAndCoplanarPoint(
      new THREE.Vector3(0, 1, 0),  
      new THREE.Vector3(0, -2, 0)  
    );
    return plane;
  }, []);
  
  const intersection = useMemo(() => new THREE.Vector3(), []);
  
  
  const material = useMemo(() => new THREE.MeshBasicMaterial({ 
    vertexColors: true,
    transparent: true,
  }), []);

  const mergedGeometry = useMergeGeometry(gltf, id);
  const { startDragging } = useDragInteractions(
    id, gl, raycaster, camera, mouse, dragPlane, intersection
  );
 
  const { isRotating, rotatingCornerIndex, startRotating } = useRotationInteraction(
    id, groupRef, gl, raycaster, camera, mouse, dragPlane, intersection, modelCenter
  );

  const onPointerDown = (e) => {
    e.stopPropagation();

    if(!isDragging){
      store.selectModel(id);
    }
    if (e.object.userData?.isCornerSphere) {
      startRotating(e, e.object.userData.cornerIndex);
      return;
    }

    startDragging(e);
  };
  
  useEffect(() => {
    const handleCanvasClick = (e) => {
      if (e.target === gl.domElement && e.currentTarget === gl.domElement) {
        store.selectModel(null);
      }
    };
    
    gl.domElement.addEventListener('click', handleCanvasClick);
    
    return () => {
      gl.domElement.removeEventListener('click', handleCanvasClick);
    };
  }, [gl.domElement]);

  const cleanupBoundingBox = () => {
    if (boundingBoxInfo && groupRef.current) {
      // Clean up circles if they exist
      if (boundingBoxInfo.circles) {
        boundingBoxInfo.circles.forEach(circle => {
          groupRef.current.remove(circle);
          circle.geometry.dispose();
          circle.material.dispose();
        });
      }
      
      // Clean up lines if they exist
      if (boundingBoxInfo.lines) {
        boundingBoxInfo.lines.forEach(line => {
          groupRef.current.remove(line);
          line.geometry.dispose();
          line.material.dispose();
        });
      }

      setBoundingBoxInfo(null);
    }
  };
  
useEffect(() => {
  cleanupBoundingBox();
  
  if (!groupRef.current || !mergedGeometry) {
    setBoundingBoxInfo(null);
    return;
  }

  // If neither selected nor hovered, do nothing
  if (!isSelected && !isHovered) {
    setBoundingBoxInfo(null);
    return;
  }

  // Get the raw geometry bounds before any transformations
  const geomBoundingBox = mergedGeometry.boundingBox || 
    (mergedGeometry.computeBoundingBox(), mergedGeometry.boundingBox);
  
  const min = geomBoundingBox.min.clone();
  const max = geomBoundingBox.max.clone();
  
  const yPos = 4; // Use consistent height
  
  // Create corners based on raw geometry bounds only
  const corners = [
    new THREE.Vector3(min.x, yPos, min.z), 
    new THREE.Vector3(max.x, yPos, min.z), 
    new THREE.Vector3(max.x, yPos, max.z), 
    new THREE.Vector3(min.x, yPos, max.z), 
  ];
  
  const circleColor = "#c59d1d";
  const lineMaterial = new THREE.LineBasicMaterial({ color: "#c59d1d", linewidth: 5 });
  const lines = [];
  
  // Create frame lines
  for (let i = 0; i < 4; i++) {
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      corners[i],
      corners[(i + 1) % 4],
    ]);
    
    const line = new THREE.Line(lineGeometry, lineMaterial);
    line.raycast = () => {};
    groupRef.current.add(line);
    lines.push(line);
  }
  
  const circles = [];
  if (isSelected) {
    const circleMaterial = new THREE.MeshBasicMaterial({ color: circleColor });
    const circleRadius = 0.3;
    const circleSegments = 16;
    const circleGeometry = new THREE.CircleGeometry(circleRadius, circleSegments);
   
    corners.forEach((position, index) => {
      const circle = new THREE.Mesh(circleGeometry, circleMaterial);
      circle.position.copy(position);
      circle.rotation.x = -Math.PI / 2;
      circle.userData = { 
        isCornerSphere: true,
        cornerIndex: index
      }

      groupRef.current.add(circle);
      circles.push(circle);
    });
  }
  
  // Save reference to clean up later
  setBoundingBoxInfo({
    boundingBox: geomBoundingBox,
    min: geomBoundingBox.min,
    max: geomBoundingBox.max,
    circles,
    lines
  });

  return () => {
    cleanupBoundingBox();
  };
  
}, [store.selectedModelId, isSelected, isHovered, mergedGeometry]);

  

  return (
    <group
      ref={groupRef}
      position={position}
      rotation-y={rotation} // Use this format for Three.js rotation in React Three Fiber
      onClick={(e) => {
        e.stopPropagation();
        store.selectModel(id);
      }}
      onPointerDown={onPointerDown}
      onPointerOver={() => setIsHovered(true)} 
      onPointerOut={() => setIsHovered(false)} 
    >
      {mergedGeometry && <mesh geometry={mergedGeometry} material={material}>
        <Edges threshold={15} color={0x000000} lineWidth={1} />
      </mesh>}
      
      {isSelected && <Html>
        <div style={{
          position: 'absolute',
          top: '-20px',
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '2px 5px',
          borderRadius: '3px',
          fontSize: '10px',
          userSelect: 'none',
        }}>
          {id.substring(0, 4)}
          {isDragging ? ' (dragging)' : ''}
          {isRotating ? ' (rotating)' : ''}
        </div>
      </Html>}
    </group>
  );
});

export default Model2D;