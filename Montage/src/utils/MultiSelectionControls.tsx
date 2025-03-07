import store from '../stores/ConfiguratorStore';
import { TransformControls } from '@react-three/drei';
import { observer } from 'mobx-react-lite';
import { useRef } from 'react';
import * as THREE from 'three'


const MultiSelectionControls = observer(() => {
    const selectedModels = store.selectedModels;
    const group = useRef<THREE.Group>(null);
  
    // No need for controls if nothing is selected
    if (selectedModels.length === 0) return null;
  
    // Ensure group.current is not null before rendering TransformControls
    if (!group.current) return null;
  
    return (
      <group ref={group}>
        <TransformControls
          object={group.current} // Pass group.current directly (now guaranteed to be non-null)
          mode="translate"
          onObjectChange={() => {
            if (group.current) {
              // Get the transformation delta
              const deltaX = group.current.position.x;
              const deltaY = group.current.position.y;
              const deltaZ = group.current.position.z;
  
              // Reset group position for next movement
              group.current.position.set(0, 0, 0);
  
              // Update all selected models with the delta
              selectedModels.forEach((model) => {
                const newPos: [number, number, number] = [
                  model.position[0] + deltaX,
                  model.position[1] + deltaY ,
                  model.position[2] + deltaZ,
                ];
                store.updateModelPosition(model.id, newPos);
              });
            }
          }}
        />
      </group>
    );
  });
  

export default MultiSelectionControls
