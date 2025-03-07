import { Html } from "@react-three/drei";
import store from "../stores/ConfiguratorStore.js";
import { useEffect, useMemo, useRef } from "react";
import { observer } from "mobx-react-lite";
import * as THREE from 'three';

const Model2D = observer(({ id, gltf, position }: { id: string, gltf: any, position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const isSelected = store.isSelected(id);

  // Extract edge data from the model
  const edgeData = useMemo(() => {
    const edges: Array<{
      geometry: THREE.BufferGeometry;
      matrix: THREE.Matrix4;
      color: number;
    }> = [];

    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        // Create edges geometry from the mesh's geometry
        const edgesGeometry = new THREE.EdgesGeometry(child.geometry);

        // Create a matrix to store the mesh's transformation
        const matrix = new THREE.Matrix4();
        matrix.compose(
          child.position,
          child.quaternion,
          child.scale
        );

        edges.push({
          geometry: edgesGeometry,
          matrix,
          color: isSelected ? 0x0066ff : 0x000000, // Blue if selected, black otherwise
        });
      }
    });

    return edges;
  }, [gltf, isSelected]);

  // Update position
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(position[0], position[1], position[2]);
    }
  }, [position]);

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        store.selectModel(id);
      }}
    >
      {/* Render edges for each mesh */}
      {edgeData.map((data, i) => (
        <lineSegments key={i} geometry={data.geometry} matrix={data.matrix}>
          <lineBasicMaterial
            color={data.color}
            linewidth={isSelected ? 2 : 1} // Thicker lines for selected models
          />
        </lineSegments>
      ))}

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
            fontSize: '10px'
          }}>
            {id.substring(0, 4)}
          </div>
        </Html>
      )}
    </group>
  );
});

export default Model2D;