import { computed, makeAutoObservable, action } from "mobx";
import * as THREE from 'three';
import { textureLoad } from "three/tsl";
import loadTexture from "../utils/textureLoader";

interface nodes {
  id: string;
  modelId: string;
  start: [number, number, number];
  end: [number, number, number];
  center: [number, number, number];
  primaryAxes: string;
}
interface models {
  id: string;
  gltfId?: string;
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  group: Array<THREE.Group>;
  scale: [number, number, number];
}
class ConfiguratorStore {
  models: Array<models> = [];
  selectedModelId: string | null = null; // Changed from Set to single string
  viewMode: '2D' | '3D'| 'images'  = '2D';
  nodes: Array<nodes> = [];
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
      endDragging: action,
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

  addModel(url: string, position: [number, number, number], gltfId?: string, rotation?:[number, number, number], scale?: [number, number, number]) {
    const id = Math.random().toString(36).substr(2, 9);
    if(this.models.length === 0){
      this.baseModel = id;
    }

    // const rotation: [number, number, number] = [0, 0, 0];
    // const scale: [number, number, number] = [1, 1, 1];
    this.models.push({
      id,
      url,
      position,
      rotation: rotation || [0, 0, 0],
      group: [],
      gltfId,
      scale: scale ||[1, 1, 1],
    });
  }

  getModelRotation(id: string) {
    const model = this.models.find((m) => m.id === id);
    if (model) {
      return model.rotation[1];
    }
    return 0;
  }

  geModelPosition(id: string) {
    const model = this.models.find((m) => m.id === id);
    if (model) {
      return model.position;
    }
  }

  getModelScale(id: string) {
    const model = this.models.find((m) => m.id === id);
    if (model) {
      return model.scale;
    }
    return [1, 1, 1] as [number, number, number];
  }


  updateNodesOnScaling(modelId: string, newScale: [number, number, number]) {
    const modelNodes = this.nodes.filter(node => node.modelId === modelId);
    const model = this.models.find(m => m.id === modelId);
    
    if (!model || modelNodes.length === 0) {
        return;
    }

    // Calculate scale factors
    const scaleFactorX = newScale[0] / model.scale[0];
    const scaleFactorY = newScale[1] / model.scale[1];
    const scaleFactorZ = newScale[2] / model.scale[2];

    // Early return if no scaling happened
    if (scaleFactorX === 1 && scaleFactorY === 1 && scaleFactorZ === 1) return;

    // Get model rotation
    const rotation = model.rotation || [0, 0, 0];
    const yRotation = rotation[1];

    // Create rotation matrix for the current model rotation
    const rotationMatrix = new THREE.Matrix4().makeRotationY(yRotation);
    // Create inverse rotation matrix to undo rotation
    const inverseRotationMatrix = new THREE.Matrix4().makeRotationY(-yRotation);
    
    // Create scale matrix
    const scaleMatrix = new THREE.Matrix4().makeScale(scaleFactorX, scaleFactorY, scaleFactorZ);

    modelNodes.forEach(node => {
        // Get node start and end positions
        const startVec = new THREE.Vector3().fromArray(node.start);
        const endVec = new THREE.Vector3().fromArray(node.end);

        // 1. Un-rotate the points (bring them to original orientation)
        startVec.applyMatrix4(inverseRotationMatrix);
        endVec.applyMatrix4(inverseRotationMatrix);

        // 2. Apply scaling
        startVec.applyMatrix4(scaleMatrix);
        endVec.applyMatrix4(scaleMatrix);

        // 3. Re-apply rotation
        startVec.applyMatrix4(rotationMatrix);
        endVec.applyMatrix4(rotationMatrix);

        // Update node positions
        node.start = [startVec.x, startVec.y, startVec.z];
        node.end = [endVec.x, endVec.y, endVec.z];
        
        // Recalculate center
        const newCenter = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
        node.center = [newCenter.x, newCenter.y, newCenter.z];
    });
}

  setModelScale(id: string, scale: [number, number, number]) {
    const model = this.models.find((m) => m.id === id);
    if (model) {
      this.updateNodesOnScaling(id, scale);
      model.scale = scale;
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
      const texture = await loadTexture(url);
      this.models.map((model) => {
        if(type === 'Exterior Finish'){
          this.updateExternalTexture(model.id, texture);
          console.log("object")
        }
        else if(type === 'Interior Wall Finish'){
          this.updateInternalTexture(model.id, texture);
        }
        else if(type === 'Interior Floor Finish'){
          this.updateInternalFloorTexture(model.id, texture);
        }
      })
        
      
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
        mesh.material.map = texture;
        mesh.material.needsUpdate = true;
      }
      });
    }
  }

  updateInternalTexture(id: string, texture: THREE.Texture) {
    const model = this.models.find((m) => m.id === id);
    if (model) {
      model.group.map((mesh) => {
        if(mesh.name.includes('Interior')){
        mesh.material.map = texture;
        mesh.material.needsUpdate = true;
      }
      });
    }
  }


  updateInternalFloorTexture(id: string, texture: THREE.Texture) {
    const model = this.models.find((m) => m.id === id);
    if (model) {    
      model.group.map((mesh) => {
        if(mesh.name.includes('Floor')){
        mesh.material.map = texture;
        mesh.material.needsUpdate = true;
      }
      });
    }
  }


  updateNodesOnRotation(modelId: string, yRotation: number) {
    const modelNodes = this.nodes.filter(node => node.modelId === modelId);
    const model = this.models.find(m => m.id === modelId);
    
    if (!model || modelNodes.length === 0) return;
    
    const previousRotation = model.rotation[1];
    const rotationDiff = yRotation - previousRotation;
    
    if (rotationDiff === 0) return;
    
    const rotationMatrix = new THREE.Matrix4().makeRotationY(rotationDiff);
    
    modelNodes.forEach(node => {
      const start = new THREE.Vector3(node.start[0], node.start[1], node.start[2]);
      const end = new THREE.Vector3(node.end[0], node.end[1], node.end[2]);

      start.applyMatrix4(rotationMatrix);
      end.applyMatrix4(rotationMatrix);
      
      const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

      const rotatedDirection = new THREE.Vector3().subVectors(end, start).normalize();
      const newPrimaryAxis = Math.abs(rotatedDirection.x) > Math.abs(rotatedDirection.z) ? 'x' : 'z';

      node.start = [start.x, start.y, start.z];
      node.end = [end.x, end.y, end.z];
      node.center = [center.x, center.y, center.z];
      node.primaryAxes = newPrimaryAxis; 
    });

    model.rotation[1] = yRotation;
}

  updateModelRotation(id: string, yRotation: number) {
    const model = this.models.find((m) => m.id === id);
    if (model) {
      this.updateNodesOnRotation(id, yRotation);
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
    if (this.selectedModelId === id) return;
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
      this.nodes = this.nodes.filter(node => node.modelId !== this.selectedModelId);
      console.log(this.nodes);
      this.selectedModelId = null;
    }
  }

  get selectedModel() {
    return this.selectedModelId
      ? this.models.find((m) => m.id === this.selectedModelId) || null
      : null;
  }

  startDragging(modelId: string, clickPoint: [number, number, number]) {
    if (this.selectedModelId !== modelId) {
      this.selectModel(modelId);
      return false;
    }

    this.isDragging = true;

    const model = this.models.find((m) => m.id === modelId);
    if (!model) return false;

    this.dragStartPosition = [...model.position] as [number, number, number];

    this.dragOffset = [
      clickPoint[0] - model.position[0],
      clickPoint[1] - model.position[1],
      clickPoint[2] - model.position[2],
    ];

    return true; 
  }

  continueDragging(newPoint: [number, number, number]) {
    if (!this.isDragging || !this.selectedModelId || !this.dragStartPosition) return;
  
    const currentModel = this.models.find(m => m.id === this.selectedModelId);
    if (!currentModel) return;
  
    const currentNodes = this.nodes.filter(node => node.modelId === currentModel.id);
    const otherNodes = this.nodes.filter(node => node.modelId !== currentModel.id);
  
    const newPosition = new THREE.Vector3(
      newPoint[0] - this.dragOffset[0],
      newPoint[1] - this.dragOffset[1],
      newPoint[2] - this.dragOffset[2]
    );
  
    const threshold = 1;  
    let snapped = false;
  
    for (let currentNode of currentNodes) {
      const currentCenter = new THREE.Vector3(
        currentNode.center[0] + newPosition.x,-
        currentNode.center[1] + newPosition.y,
        currentNode.center[2] + newPosition.z
      );
  
      for (let otherNode of otherNodes) {
        const otherStartModel = this.models.find(m => m.id === otherNode.modelId);
        if (!otherStartModel) continue;
  
        const otherCenter = new THREE.Vector3(
          otherNode.center[0] + otherStartModel.position[0],
          otherNode.center[1] + otherStartModel.position[1],
          otherNode.center[2] + otherStartModel.position[2]
        );
  
        if (currentCenter.distanceTo(otherCenter) < threshold && currentNode.primaryAxes === otherNode.primaryAxes) {
          // if (this.checkModelOverlap(currentModel, otherStartModel)) {
          //   continue;
          // }
        
          const snapOffset = otherCenter.clone().sub(currentCenter);
          newPosition.add(snapOffset);
          console.log("object snapped");
          snapped = true;
          break;
        }
      }
      if (snapped) break;
    }
  
    this.updateModelPosition(this.selectedModelId, newPosition.toArray() as [number, number, number]);
  }

  getModelBoundingBox(model: models): THREE.Box3 {
    const bbox = new THREE.Box3();
    for (const mesh of model.group) {
        mesh.updateMatrixWorld(true);
        const meshBBox = new THREE.Box3().setFromObject(mesh);
        meshBBox.translate(new THREE.Vector3(...model.position));
        bbox.union(meshBBox);
    }
    return bbox;
}

  
checkModelOverlap(modelA: models, modelB: models): boolean {
  const bboxA = this.getModelBoundingBox(modelA);
  const bboxB = this.getModelBoundingBox(modelB);
  return bboxA.intersectsBox(bboxB);
}

  endDragging() {
    this.isDragging = false;
    this.dragStartPosition = null;
    this.dragOffset = [0, 0, 0];
  }

  isBeingDragged(id: string) {
    return this.isDragging && this.selectedModelId === id;
  }

  setNodes(modelId: string, start: [number, number, number], end: [number, number, number], center: [number, number, number], primaryAxes: string) {
    const id: string = Math.random().toString(36).substr(2, 9);
    this.nodes.push({ id, modelId, start, end, center, primaryAxes });
    console.log(this.nodes)
}

  loadModels(models) {
    models.forEach((m) =>{
      const rotation:[number, number, number] = [0,m.rotation,0];
      this.addModel(m.glbFile,m.position,m.moduleId,rotation,m.scale)});
  }

}

const store = new ConfiguratorStore();
export default store;
