import { Html, Edges } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import store from "../stores/ConfiguratorStore.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import * as THREE from "three";
import useDragInteractions from "../hooks/useDragInteraction.js";
import useMergeGeometry from "../hooks/useMergeGeometry.js";
import useRotationInteraction from "../hooks/useRotationInteraction.js";
import DesignTools from "./DesignTools.js";

const Model2D = observer(({ id, gltf }: { id: string; gltf: any }) => {
  const groupRef = useRef<THREE.Group>(null);
  const isSelected = store.isSelected(id);
  const isDragging = store.isBeingDragged(id);
  const position = store.geModelPosition(id);
  const rotation = store.getModelRotation(id);
  const scale = store.getModelScale(id);
  const [isHovered, setIsHovered] = useState(false);
  const { camera, raycaster, mouse, gl } = useThree();
  const [boundingBoxInfo, setBoundingBoxInfo] = useState(null);
  const [modelCenter, setModelCenter] = useState(
    new THREE.Vector3(position[0], position[1], position[2])
  );
  

  const dragPlane = useMemo(() => {
    const plane = new THREE.Plane();
    plane.setFromNormalAndCoplanarPoint(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, -2, 0)
    );
    return plane;
  }, []);

  const intersection = useMemo(() => new THREE.Vector3(), []);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        transparent: true,
        
      }),
    []
  );

  const { geometry } = useMergeGeometry(gltf, id, modelCenter);
  



  const { startDragging } = useDragInteractions(
    id,
    gl,
    raycaster,
    camera,
    mouse,
    dragPlane,
    intersection
  );

  const { isRotating, rotatingCornerIndex, startRotating } =
    useRotationInteraction(
      id,
      groupRef,
      gl,
      raycaster,
      camera,
      mouse,
      dragPlane,
      intersection,
      modelCenter
    );

    const mirrorHorizontally = () => {
      const currentScale = store.getModelScale(id);
      const rotation = store.getModelRotation(id);
      const yRotation = rotation;
      
      // Normalize rotation to 0-360 degrees (assuming rotation is in radians)
      const normalizedRotation = ((yRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      
      // Check if rotation is around 90 or 270 degrees (with some tolerance)
      const isNear90Deg = Math.abs(normalizedRotation - Math.PI/2) < 0.1;
      const isNear270Deg = Math.abs(normalizedRotation - 3*Math.PI/2) < 0.1;
      
      if (isNear90Deg || isNear270Deg) {
        // When rotated 90/270 degrees, "horizontal" mirroring should affect Z axis
        const newScaleZ = currentScale[2] > 0 ? -Math.abs(currentScale[2]) : Math.abs(currentScale[2]);
        store.setModelScale(id, [currentScale[0], currentScale[1], newScaleZ]);
      } else {
        // Normal case - horizontal mirroring affects X axis
        const newScaleX = currentScale[0] > 0 ? -Math.abs(currentScale[0]) : Math.abs(currentScale[0]);
        store.setModelScale(id, [newScaleX, currentScale[1], currentScale[2]]);
      }
    };
    
    const mirrorVertically = () => {
      const currentScale = store.getModelScale(id);
      const rotation = store.getModelRotation(id);
      const yRotation = rotation;
      
      // Normalize rotation to 0-360 degrees
      const normalizedRotation = ((yRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      
      // Check if rotation is around 90 or 270 degrees
      const isNear90Deg = Math.abs(normalizedRotation - Math.PI/2) < 0.1;
      const isNear270Deg = Math.abs(normalizedRotation - 3*Math.PI/2) < 0.1;
      
      if (isNear90Deg || isNear270Deg) {
        // When rotated 90/270 degrees, "vertical" mirroring should affect X axis
        const newScaleX = currentScale[0] > 0 ? -Math.abs(currentScale[0]) : Math.abs(currentScale[0]);
        store.setModelScale(id, [newScaleX, currentScale[1], currentScale[2]]);
      } else {
        // Normal case - vertical mirroring affects Z axis
        const newScaleZ = currentScale[2] > 0 ? -Math.abs(currentScale[2]) : Math.abs(currentScale[2]);
        store.setModelScale(id, [currentScale[0], currentScale[1], newScaleZ]);
      }
    };

  const onPointerDown = (e) => {
    e.stopPropagation();

    if (!isDragging) {
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

    gl.domElement.addEventListener("click", handleCanvasClick);

    return () => {
      gl.domElement.removeEventListener("click", handleCanvasClick);
    };
  }, [gl.domElement]);

  const cleanupBoundingBox = () => {
    if (boundingBoxInfo && groupRef.current) {
      if (boundingBoxInfo.circles) {
        boundingBoxInfo.circles.forEach((circle) => {
          groupRef.current.remove(circle);
          circle.geometry.dispose();
          circle.material.dispose();
        });
      }

      if (boundingBoxInfo.lines) {
        boundingBoxInfo.lines.forEach((line) => {
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

    if (!groupRef.current || !geometry) {
      setBoundingBoxInfo(null);
      return;
    }

    if (!isSelected && !isHovered) {
      setBoundingBoxInfo(null);
      return;
    }

    const geomBoundingBox =
      geometry.boundingBox ||
      (geometry.computeBoundingBox(), geometry.boundingBox);

    const min = geomBoundingBox.min;
    const max = geomBoundingBox.max;

    const yPos = 4; // Use consistent height

    const corners = [
      new THREE.Vector3(min.x, yPos, min.z),
      new THREE.Vector3(max.x, yPos, min.z),
      new THREE.Vector3(max.x, yPos, max.z),
      new THREE.Vector3(min.x, yPos, max.z),
    ];

    const circleColor = "#c59d1d";
    const lineMaterial = new THREE.LineBasicMaterial({
      color: "#c59d1d",
      linewidth: 5,
    });
    const lines = [];

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
      const circleMaterial = new THREE.MeshBasicMaterial({
        color: circleColor,
      });
      const circleRadius = 0.3;
      const circleSegments = 16;
      const circleGeometry = new THREE.CircleGeometry(
        circleRadius,
        circleSegments
      );

      corners.forEach((position, index) => {
        const circle = new THREE.Mesh(circleGeometry, circleMaterial);
        circle.position.copy(position);
        circle.rotation.x = -Math.PI / 2;
        circle.userData = {
          isCornerSphere: true,
          cornerIndex: index,
        };

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
      lines,
    });

    return () => {
      cleanupBoundingBox();
    };
  }, [store.selectedModelId, isSelected, isHovered, geometry]);

  
  useEffect(() =>{
    setModelCenter(new THREE.Vector3(position[0], position[1], position[2]))
  },[position])
 

  return (
    <>
    <group
      ref={groupRef}
      position={position}
      rotation-y={rotation} 
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        store.selectModel(id);
      }}
      onPointerDown={onPointerDown}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      {geometry && (
  <>
    <mesh geometry={geometry} material={material}>
      <Edges threshold={5} color={0xfefefe} lineWidth={1} />
    </mesh>
    
    <lineSegments>
      <edgesGeometry args={[geometry]} />
      <lineBasicMaterial color="#0f0f0f" linewidth={1} />
    </lineSegments>
  </>
)}
      {isSelected && (
        <DesignTools mirrorHorizontal={mirrorHorizontally} mirrorVertical={mirrorVertically}/>
      )}
      
    </group>
    {
      store.nodes?.map((endpoint) => (
       endpoint.modelId === id &&
        <>
        <mesh
          position={[endpoint?.center[0] +  modelCenter.x,4,endpoint?.center[2] + modelCenter.z]}
        >
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial color="red" />
        </mesh>
      </>
      ))
    }
    </>
  );
});

export default Model2D;