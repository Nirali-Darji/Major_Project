import { computed, makeAutoObservable, action } from "mobx";
import * as THREE from 'three';

class ConfiguratorStore {
  models: Array<{ id: string; gltfId?: string; url: string; position: [number, number, number]; rotation: [number, number, number]; group: Array<THREE.Mesh> }> = [];
  selectedModelId: string | null = null; // Changed from Set to single string
  viewMode: '2D' | '3D'| 'images' = '2D';
  
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

  setViewMode(mode: '2D' | '3D' | 'images') {
    this.viewMode = mode;
  }

  addModel(url: string, position: [number, number, number], gltfId?: string) {
    const id = Math.random().toString(36).substr(2, 9);
    const rotation: [number, number, number] = [0, 0, 0];
    this.models.push({
      id,
      url,
      position,
      rotation,
      group: [],
      gltfId
    });
    // this.selectModel(id);
  }

  addModelToGroup(id: string, mesh: THREE.Mesh) {
    const model = this.models.find((m) => m.id === id);
    if (model) {
      model.group.push(mesh);
    }
  }

 updateTexture(id: string, texture: THREE.Texture) {
    const model = this.models.find((m) => m.id === id);
    if (model) {
      model.texture = texture;
    }
  }

  updateModelRotation(id: string, rotation: [number, number, number]) {
    const model = this.models.find((m) => m.id === id);
    if (model) {
      model.rotation = rotation;
    }
  }

  updateModelPosition(id: string, position: [number, number, number]) {
    const model = this.models.find((m) => m.id === id);
    if (model) {
      model.position = position;
    }
  }

  selectModel(id: string | null) {
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
  
  // Dragging operations
  
  // Start dragging the selected model
  startDragging(modelId: string, clickPoint: [number, number, number]) {
    // Only allow dragging the selected model
    if (this.selectedModelId !== modelId) {
      this.selectModel(modelId);
      return false; // Don't start dragging yet, just select
    }
    
    this.isDragging = true;
    
    // Find the model that was clicked
    const model = this.models.find(m => m.id === modelId);
    if (!model) return false;
    
    // Store the starting position
    this.dragStartPosition = [...model.position] as [number, number, number];
    
    // Calculate drag offset (difference between click point and model position)
    this.dragOffset = [
      clickPoint[0] - model.position[0],
      clickPoint[1] - model.position[1],
      clickPoint[2] - model.position[2]
    ];
    
    return true; // Successfully started dragging
  }
  
  // Continue dragging with updated mouse position
  continueDragging(newPoint: [number, number, number]) {
    if (!this.isDragging || !this.selectedModelId || !this.dragStartPosition) return;
    
    // Calculate the new position for the dragged model
    const newPosition: [number, number, number] = [
      newPoint[0] - this.dragOffset[0],
      newPoint[1] - this.dragOffset[1],
      newPoint[2] - this.dragOffset[2]
    ];
    
    // Update the model position
    this.updateModelPosition(this.selectedModelId, newPosition);
  }
  
  // End the dragging operation
  endDragging() {
    this.isDragging = false;
    this.dragStartPosition = null;
    this.dragOffset = [0, 0, 0];
  }
  
  // Check if the model is being dragged
  isBeingDragged(id: string) {
    return this.isDragging && this.selectedModelId === id;
  }
}

const store = new ConfiguratorStore();
export default store;