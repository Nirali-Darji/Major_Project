import { Html, Edges } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import store from "../stores/ConfiguratorStore.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import * as THREE from 'three';
import { BufferGeometryUtils } from "three/examples/jsm/Addons.js";

const Model2D = observer(({ id, gltf, position }: { id: string, gltf: any, position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const isSelected = store.isSelected(id);
  const isDragging = store.isBeingDragged(id);
  const [boundingBoxInfo, setBoundingBoxInfo] = useState(null);
  const [isHovered, setIsHovered] = useState(false); // Track hover state

  const { camera, raycaster, mouse, gl } = useThree();
  const dragPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0)), []);
  const intersection = useMemo(() => new THREE.Vector3(), []);

  // Merge all geometries into one
  const mergedGeometry = useMemo(() => {
    const geometries: THREE.BufferGeometry[] = [];

    if (gltf && gltf.scene) {
      gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
          // Skip meshes that should be hidden
          if (child.name.includes("Roof")) {
            return; // Skip this mesh
          }
          
          // Clone the geometry and apply the mesh's transformation
          const geometry = child.geometry.clone();
          geometry.applyMatrix4(child.matrixWorld);

          // Ensure all geometries have a "uv" attribute
          if (!geometry.attributes.uv) {
            // Add a dummy "uv" attribute if it doesn't exist
            const uvs = new Float32Array(geometry.attributes.position.count * 2);
            geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
          }

          // Create vertex colors for this geometry
          const colors = new Float32Array(geometry.attributes.position.count * 3);
          const color = new THREE.Color();

          // Set vertex colors based on the child's name
          if (child.name.includes("Node")) {
            color.set("cyan"); // Cyan for Node
          } else if(child.name.includes("Floor")){
            color.set("#dedede");
          } else {
            color.set(new THREE.Color("#ffffff")); // Default white
          }

          // Apply the color to all vertices of this geometry
          for (let i = 0; i < colors.length; i += 3) {
            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
          }

          // Add the color attribute to the geometry
          geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

          geometries.push(geometry);
        }
      });
    }

    // Merge all geometries into one
    if (geometries.length > 0) {
      try {
        return BufferGeometryUtils.mergeGeometries(geometries);
      } catch (error) {
        console.error("Failed to merge geometries:", error);
        return null;
      }
    }

    return null;
  }, [gltf]);

  // Create a material that uses vertex colors
  const material = useMemo(() => new THREE.MeshBasicMaterial({ 
    vertexColors: true,
    transparent: true,
    opacity: isDragging ? 0.7 : 1 
  }), [isDragging]);
  
  // Get intersection point with the drag plane
  const getIntersectionPoint = (e) => {
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
  };

  const onPointerDown = (e) => {
    e.stopPropagation();
    if(!isDragging){
      store.selectModel(id);
      console.log(store.selectedModelId)
    }
    const clickPoint = getIntersectionPoint(e);
    
    const startedDragging = store.startDragging(id, clickPoint);
    
    if (startedDragging) {
      gl.domElement.style.cursor = 'grabbing';
      
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    }
  };
  
  const onPointerMove = (e) => {
    if (!store.isDragging) return;
    
    const newPoint = getIntersectionPoint(e);
    store.continueDragging(newPoint);
  };
  
  const onPointerUp = () => {
    if (!store.isDragging) return;
    
    store.endDragging();
    gl.domElement.style.cursor = 'auto';
    
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  };

  // Handle canvas background click to deselect
  useEffect(() => {
    const handleCanvasClick = (e) => {
      // Only handle direct canvas clicks (not bubbled events)
      if (e.target === gl.domElement && e.currentTarget === gl.domElement) {
        store.selectModel(null);
      }
    };
    
    gl.domElement.addEventListener('click', handleCanvasClick);
    
    return () => {
      gl.domElement.removeEventListener('click', handleCanvasClick);
    };
  }, [gl.domElement]);

  // Update position
  useEffect(() => {
    cleanupBoundingBox();

    if (groupRef.current) {
      groupRef.current.position.set(position[0], position[1], position[2]);
    }
  }, [position]);

  // Clean up bounding box elements
  const cleanupBoundingBox = () => {
    if (boundingBoxInfo && groupRef.current) {
      boundingBoxInfo.circles.forEach(circle => {
        groupRef.current.remove(circle);
        circle.geometry.dispose();
        circle.material.dispose();
      });
      
      boundingBoxInfo.lines.forEach(line => {
        groupRef.current.remove(line);
        line.geometry.dispose();
        line.material.dispose();
      });
    }
  };

  // Calculate and update 2D bounding box with circle corners
  useEffect(() => {
    cleanupBoundingBox();
    if ((!isSelected && !isHovered) || !groupRef.current || !mergedGeometry) {
      setBoundingBoxInfo(null);
      return;
    }

    const boundingBox = new THREE.Box3().setFromObject(groupRef.current);
    
    const min = boundingBox.min.clone();
    const max = boundingBox.max.clone();
    
    min.sub(new THREE.Vector3(position[0], position[1], position[2]));
    max.sub(new THREE.Vector3(position[0], position[1], position[2]));
    
    const yPos = 0.01;
    
    const corners = [
      new THREE.Vector3(min.x, yPos, min.z), // bottom-left
      new THREE.Vector3(max.x, yPos, min.z), // bottom-right
      new THREE.Vector3(max.x, yPos, max.z), 
      new THREE.Vector3(min.x, yPos, max.z), 
    ];
    
    const circleColor = 0x6666ff; 
    const circleMaterial = new THREE.MeshBasicMaterial({ color: circleColor });
    const circleRadius = 0.15;
    const circleSegments = 16;
    const circleGeometry = new THREE.CircleGeometry(circleRadius, circleSegments);
    
    const circles = corners.map(position => {
      const circle = new THREE.Mesh(circleGeometry, circleMaterial);
      circle.position.copy(position);
      circle.rotation.x = -Math.PI / 2;
      groupRef.current.add(circle);
      return circle;
    });
    
    // Create lines connecting the corners
    const lineMaterial = new THREE.LineBasicMaterial({ color: circleColor });
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
    
    // Save references to clean up later
    setBoundingBoxInfo({
      boundingBox,
      min,
      max,
      circles,
      lines
    });
    
  }, [isSelected, isHovered, mergedGeometry, position]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      cleanupBoundingBox();
    };
  }, []);

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerDown={onPointerDown}
      onPointerOver={() => setIsHovered(true)} // Set hover state to true
      onPointerOut={() => setIsHovered(false)} // Set hover state to false
    >
      {/* Render the merged geometry with edges */}
      {mergedGeometry && (
        <mesh geometry={mergedGeometry} material={material}>
          {/* Show edges only when selected or hovered */}
        
            <Edges
              threshold={10} // Angle threshold for edge detection
              color={isSelected ? 0x6666ff : 0x000000} 
            />
        
        </mesh>
      )}

      {/* Model label */}
      {isSelected && (
        <Html>
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
          </div>
        </Html>
      )}
    </group>
  );
});

export default Model2D;