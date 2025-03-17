import { useEffect, useRef, useState } from "react";
import store from "../stores/ConfiguratorStore";
import getInterSection from "../utils/getInterSection";
import gsap from "gsap";

const useRotationInteraction = (
  id,
  groupRef,
  gl,
  raycaster,
  camera,
  mouse,
  dragPlane,
  intersection,
  modelCenter
) => {
  const [isRotating, setIsRotating] = useState(false);
  const [rotatingCornerIndex, setRotatingCornerIndex] = useState(-1);
  const lastDragPoint = useRef(null);
  const rotationTween = useRef(null);
  const initialRotation = useRef(0);

  // Normalize angle to range [0, 2π)
  const normalizeAngle = (angle) => {
    return ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  };

  const onRotateMove = (e) => {
    if (!isRotating) return;

    // Kill any existing animation
    if (rotationTween.current) {
      rotationTween.current.kill();
      rotationTween.current = null;
    }

    const newPoint = getInterSection(
      dragPlane,
      intersection,
      raycaster,
      camera,
      mouse,
      gl,
      e
    );

    if (!newPoint || !lastDragPoint.current) {
      if (newPoint) lastDragPoint.current = newPoint;
      return;
    }

    // Calculate rotation angle based on intersection points
    const newAngle = Math.atan2(
      newPoint[2] - modelCenter.z,
      newPoint[0] - modelCenter.x
    );

    const prevAngle = Math.atan2(
      lastDragPoint.current[2] - modelCenter.z,
      lastDragPoint.current[0] - modelCenter.x
    );

    // Calculate angle difference
    let angleDiff = newAngle - prevAngle;

    // Ensure shortest path
    if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

    // Get current rotation and apply the difference
    const currentRotation = store.getModelRotation(id);
    const newRotation = normalizeAngle(currentRotation - angleDiff);

    // Update model rotation
    store.updateModelRotation(id, newRotation);

    // Update last drag point
    lastDragPoint.current = newPoint;
  };

  const snapToNearestAngle = () => {
    // Get current rotation
    const currentRotation = store.getModelRotation(id);

    // Calculate nearest 90-degree increment
    const degrees = (currentRotation * 180) / Math.PI;
    const snappedDegrees = Math.round(degrees / 90) * 90;
    const snappedRadians = (snappedDegrees * Math.PI) / 180;

    // Ensure we use the shortest path to target angle
    let diff = snappedRadians - currentRotation;
    if (diff > Math.PI) diff -= 2 * Math.PI;
    if (diff < -Math.PI) diff += 2 * Math.PI;

    // Animate to the snapped angle
    rotationTween.current = gsap.to(
      {},
      {
        duration: 0.5,
        ease: "power3.out",
        onUpdate: function () {
          const progress = this.progress();
          const rotationValue = normalizeAngle(
            currentRotation + diff * progress
          );
          store.updateModelRotation(id, rotationValue);
        },
        onComplete: () => {
          store.updateModelRotation(id, normalizeAngle(snappedRadians));
          rotationTween.current = null;
        },
      }
    );
  };

  const onRotateUp = () => {
    if (!isRotating) return;

    setIsRotating(false);
    setRotatingCornerIndex(-1);
    gl.domElement.style.cursor = "auto";

    // Snap to nearest 90 degree increment
    snapToNearestAngle();

    lastDragPoint.current = null;
    window.removeEventListener("pointermove", onRotateMove);
    window.removeEventListener("pointerup", onRotateUp);
  };

  const startRotating = (e, cornerIndex) => {
    // Kill any existing animation
    if (rotationTween.current) {
      rotationTween.current.kill();
      rotationTween.current = null;
    }

    setIsRotating(true);
    setRotatingCornerIndex(cornerIndex);

    // Reset last drag point
    lastDragPoint.current = null;

    // Store initial rotation
    initialRotation.current = store.getModelRotation(id);

    // Get intersection point
    const clickPoint = getInterSection(
      dragPlane,
      intersection,
      raycaster,
      camera,
      mouse,
      gl,
      e
    );

    if (clickPoint) {
      lastDragPoint.current = clickPoint;
    }

    gl.domElement.style.cursor = "grab";

    window.addEventListener("pointermove", onRotateMove);
    window.addEventListener("pointerup", onRotateUp);
  };

  // Clean up event listeners and animations on unmount
  useEffect(() => {
    return () => {
      if (rotationTween.current) {
        rotationTween.current.kill();
      }
      window.removeEventListener("pointermove", onRotateMove);
      window.removeEventListener("pointerup", onRotateUp);
    };
  }, []);

  return { isRotating, rotatingCornerIndex, startRotating };
};

export default useRotationInteraction;
