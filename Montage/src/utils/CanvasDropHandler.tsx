import { observer } from "mobx-react-lite";
import store from "../stores/ConfiguratorStore";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

const CanvasDropHandler = observer(() => {
    const { gl } = useThree(); // Access the WebGL renderer
  
    useEffect(() => {
      const handleDragOver = (e: DragEvent) => {
        e.preventDefault(); // Prevent default behavior
      };
  
      const handleDrop = (e: DragEvent) => {
        e.preventDefault();
  
        // Check if the drop is a file or a model URL
        const url = e.dataTransfer?.getData('text/plain');
        if (url) {
          // Handle model URL drop (from SelectionBar)
          store.addModel(url);
        } 
        
      };
  
      const canvas = gl.domElement; // Get the canvas element
      canvas.addEventListener('dragover', handleDragOver);
      canvas.addEventListener('drop', handleDrop);
  
      return () => {
        canvas.removeEventListener('dragover', handleDragOver);
        canvas.removeEventListener('drop', handleDrop);
      };
    }, [gl]);
  
    return null; // This component doesn't render anything
  });

export default CanvasDropHandler
