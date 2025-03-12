import { useEffect, useRef, useState } from "react";
import store from "../stores/ConfiguratorStore";
import getInterSection from "../utils/getInterSection";

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
  // const startAngle = useRef(0);
  const currentRotation = useRef(0);
  const lastDragPoint = useRef(null);
  const animationStartTime = useRef(0);
  const animationStartRotation = useRef(0);
  const animationTargetRotation = useRef(0);
  const isAnimating = useRef(false);

  // Animation parameters
  const ANIMATION_DURATION = 300; // ms

  // Normalize angle to range [0, 2π)
  const normalizeAngle = (angle) => {
    return ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  };

  // Choose shortest rotation path
  const getShortestRotation = (from, to) => {
    const diff = normalizeAngle(to) - normalizeAngle(from);
    if (diff > Math.PI) return diff - 2 * Math.PI;
    if (diff < -Math.PI) return diff + 2 * Math.PI;
    return diff;
  };

  const onRotateMove = (e) => {
    if (!isRotating || isAnimating.current) return;

    const newPoint = getInterSection(
      dragPlane,
      intersection,
      raycaster,
      camera,
      mouse,
      gl,
      e
    );

    // First-time initialization of lastDragPoint
    if (!lastDragPoint.current) {
      lastDragPoint.current = newPoint;
      return;
    }

    const newAngle = Math.atan2(
      newPoint[2] - modelCenter.z,
      newPoint[0] - modelCenter.x
    );

    const prevAngle = Math.atan2(
      lastDragPoint.current[2] - modelCenter.z,
      lastDragPoint.current[0] - modelCenter.x
    );

    // Calculate shortest rotation path
    const angleDiff = getShortestRotation(prevAngle, newAngle);
    
    // Update rotation in the store
    const newRotation = normalizeAngle(currentRotation.current - angleDiff);
    store.updateModelRotation(id, newRotation);
    currentRotation.current = newRotation;
    
    // Update last drag point
    lastDragPoint.current = newPoint;
  };

  const updateAnimation = () => {
    if (!isAnimating.current) return;

    const elapsed = Date.now() - animationStartTime.current;
    const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
    
    // Easing function (cubic ease-out)
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    
    const rotationDiff = getShortestRotation(
      animationStartRotation.current,
      animationTargetRotation.current
    );
    
    const currentRot = normalizeAngle(
      animationStartRotation.current + rotationDiff * easedProgress
    );
    
    // Apply the rotation through the store
    store.updateModelRotation(id, currentRot);
    
    if (progress < 1) {
      // Continue animation
      requestAnimationFrame(updateAnimation);
    } else {
      // Animation complete
      store.updateModelRotation(id, animationTargetRotation.current);
      currentRotation.current = animationTargetRotation.current;
      isAnimating.current = false;
    }
  };

  const startSnapAnimation = (currentRot, targetRot) => {
    // Store animation parameters
    animationStartRotation.current = currentRot;
    animationTargetRotation.current = targetRot;
    animationStartTime.current = Date.now();
    isAnimating.current = true;
    
    // Start animation loop
    requestAnimationFrame(updateAnimation);
  };

  const onRotateUp = () => {
    if (!isRotating) return;

    setIsRotating(false);
    setRotatingCornerIndex(-1);
    gl.domElement.style.cursor = "auto";
    lastDragPoint.current = null;

    // Calculate nearest 90 degree increment
    const currentRot = normalizeAngle(store.getModelRotation(id));
    const degrees = (currentRot * 180) / Math.PI;
    const snappedDegrees = Math.round(degrees / 90) * 90;
    const snappedRadians = normalizeAngle((snappedDegrees * Math.PI) / 180);
    
    // Start smooth animation to snapped angle (using shortest path)
    startSnapAnimation(currentRot, snappedRadians);
    
    window.removeEventListener("pointermove", onRotateMove);
    window.removeEventListener("pointerup", onRotateUp);
  };

  const startRotating = (e, cornerIndex) => {
    // Stop any ongoing animation
    isAnimating.current = false;
    
    setIsRotating(true);
    setRotatingCornerIndex(cornerIndex);

    // Reset last drag point
    lastDragPoint.current = null;

    // Get current rotation from store
    currentRotation.current = normalizeAngle(store.getModelRotation(id));

    const clickPoint = getInterSection(
      dragPlane,
      intersection,
      raycaster,
      camera,
      mouse,
      gl,
      e
    );
    
    // Initialize lastDragPoint
    lastDragPoint.current = clickPoint;

    gl.domElement.style.cursor = "grab";

    window.addEventListener("pointermove", onRotateMove);
    window.addEventListener("pointerup", onRotateUp);
  };

  // Set up and clean up animation frame
  useEffect(() => {
    return () => {
      // Force cleanup if component unmounts during animation
      isAnimating.current = false;
      window.removeEventListener("pointermove", onRotateMove);
      window.removeEventListener("pointerup", onRotateUp);
    };
  }, []);

  return { isRotating, rotatingCornerIndex, startRotating };
};

export default useRotationInteraction;