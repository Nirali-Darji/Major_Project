import { computed, makeAutoObservable, action } from "mobx";
import * as THREE from 'three';
import { textureLoad } from "three/tsl";
import loadTexture from "../utils/textureLoader";

class ConfiguratorStore {
  models: Array<{ id: string; gltfId?: string; url: string; position: [number, number, number]; rotation: [number, number, number]; group: Array<THREE.Mesh> }> = [];
  selectedModelId: string | null = null; // Changed from Set to single string
  viewMode: '2D' | '3D'| 'images' = '2D';
  baseModel:string=""
  showDetails:boolean = false;
  
  // Dragging state
  isDragging: boolean = false;
  dragStartPosition: [number, number, number] | null = null;
  dragOffset: [number, number, number] = [0, 0, 0];


  constructor() {
    makeAutoObservable(this, {
      selectedModel: computed,
      startDragging: action,
      continueDragging: action,
      endDragging: action
    });
  }

setBaseModel(id:string){
  this.baseModel = id;
}

setShowDetails(value:boolean){
  this.showDetails =value
}

  setViewMode(mode: '2D' | '3D' | 'images') {
    this.viewMode = mode;
  }

  addModel(url: string, position: [number, number, number], gltfId?: string) {
    const id = Math.random().toString(36).substr(2, 9);
    if(this.models.length === 0){
      this.baseModel = id;
    }

    const rotation: [number, number, number] = [0, 0, 0];
    this.models.push({
      id,
      url,
      position,
      rotation,
      group: [],
      gltfId
    });
  }

  getModelRotation(id:string) {
    const model = this.models.find((m) => m.id === id);
    if (model) {
      return model.rotation[1];
    }
    return 0;
  }

  geModelPosition(id:string){
 const model = this.models.find((m) => m.id === id);
 if(model){
  return model.position;
 }
  }
  addModelToGroup(id: string, mesh: THREE.Mesh) {
    const model = this.models.find((m) => m.id === id);
    if (model) {
      model.group.push(mesh);
    }
  }

 async updateTexture(type: string, url: string) {
    // const model = this.models.find((m) => m.id === id);
    // const model = this.models.find((m) => m.id === this.selectedModelId);
    if (!url) {
      console.error("Invalid texture URL:", url);
      return;
    }
    try{
      const texture = await loadTexture(url)
      console.log(texture)
      if(this.selectedModelId){
        if(type === 'Exterior Finish'){
          this.updateExternalTexture(this.selectedModelId, texture);
        };
        if(type === 'Interior Wall Finish'){
          this.updateInternalTexture(this.selectedModelId, texture);
        };
      }
    }
    catch(error){
      console.log(error)
    }
    
  }

  updateExternalTexture(id: string, texture: THREE.Texture) {
    const model = this.models.find((m) => m.id === id);
    if (model) {
      model.group.forEach((mesh) => {
        if(mesh.name.includes('External')){
        mesh.material.map = texture;}
      });
    }
  }

  updateInternalTexture(id: string, texture: THREE.Texture) {
    const model = this.models.find((m) => m.id === id);
    if (model) {
      model.group.forEach((mesh) => {
        if(!mesh.name.includes('Internal')){
        mesh.material.map = texture;}
      });
    }
  }

  updateModelRotation(id: string, yRotation: number) {
    const model = this.models.find((m) => m.id === id);
    if (model) {
      model.rotation[1] = yRotation;
    }
  }

  updateModelPosition(id: string, position: [number, number, number]) {
    if(this.baseModel === id){
      return;
    }
    const model = this.models.find((m) => m.id === id);
    if (model) {
      model.position = position;
    }
  }

  selectModel(id: string | null) {
    if(this.selectedModelId === id) return;
    this.selectedModelId = id;
    
    if (this.isDragging) {
      this.endDragging();
    }
  }

  isSelected(id: string) {
    return this.selectedModelId === id;
  }

  removeModel(id: string) {
    this.models = this.models.filter((m) => m.id !== id);
    
    if (this.selectedModelId === id) {
      this.selectedModelId = null;
    }
  }

  removeSelectedModel() {
    if (this.selectedModelId) {
      this.models = this.models.filter((m) => m.id !== this.selectedModelId);
      this.selectedModelId = null;
    }
  }

  get selectedModel() {
    return this.selectedModelId 
      ? this.models.find(m => m.id === this.selectedModelId) || null 
      : null;
  }
  
  
  startDragging(modelId: string, clickPoint: [number, number, number]) {
    if (this.selectedModelId !== modelId) {
      this.selectModel(modelId);
      return false; 
    }
    
    this.isDragging = true;
    
    const model = this.models.find(m => m.id === modelId);
    if (!model) return false;
    
    this.dragStartPosition = [...model.position] as [number, number, number];
    
    this.dragOffset = [
      clickPoint[0] - model.position[0],
      clickPoint[1] - model.position[1],
      clickPoint[2] - model.position[2]
    ];
    
    return true; // Successfully started dragging
  }
  
  continueDragging(newPoint: [number, number, number]) {
    if (!this.isDragging || !this.selectedModelId || !this.dragStartPosition) return;
    
    const newPosition: [number, number, number] = [
      newPoint[0] - this.dragOffset[0],
      newPoint[1] - this.dragOffset[1],
      newPoint[2] - this.dragOffset[2]
    ];
    
    this.updateModelPosition(this.selectedModelId, newPosition);
  }
  
  endDragging() {
    this.isDragging = false;
    this.dragStartPosition = null;
    this.dragOffset = [0, 0, 0];
  }
  
  isBeingDragged(id: string) {
    return this.isDragging && this.selectedModelId === id;
  }

  
//   flipHorizontal() {
//     if (this.selectedModelId) {
//         const model = this.models.find((m) => m.id === this.selectedModelId);
//         if (model && model.group.length > 0) {
//             const scene = model.group[0].parent; // Get GLTF scene (THREE.Group)
//             console.log('Scene :',scene)
//             if (scene) {
//                 scene.applyMatrix4(new THREE.Matrix4().scale(new THREE.Vector3(-1, 1, 1))); // Flip X-axis
//             }
            
//         }
//     }
    
// }

// flipVertical() {
//     if (this.selectedModelId) {
//         const model = this.models.find((m) => m.id === this.selectedModelId);
//         if (model && model.group.length > 0) {
//             const scene = model.group[0].parent; // Get GLTF scene (THREE.Group)
//             if (scene) {
//                 scene.applyMatrix4(new THREE.Matrix4().scale(new THREE.Vector3(1, 1, -1))); // Flip Y-axis
//             }
//         }
//     }
// }

}

const store = new ConfiguratorStore();
export default store;