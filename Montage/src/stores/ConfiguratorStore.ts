import { computed, makeAutoObservable, action } from "mobx";

class ConfiguratorStore {
  models: Array<{ id: string; url: string; position: [number, number, number] }> = [];
  selectedModelId: string | null = null; // Changed from Set to single string
  viewMode: '2D' | '3D' = '2D';
  
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

  setViewMode(mode: '2D' | '3D') {
    this.viewMode = mode;
  }

  addModel(url: string) {
    const id = Math.random().toString(36).substr(2, 9);
    const position: [number, number, number] = [
      this.models.length * 2, // Space models along the X-axis
      0,
      0,
    ];
    this.models.push({
      id,
      url,
      position,
    });
    this.selectModel(id);
  }

  addModels(urls: string[]) {
    let lastId = '';

    urls.forEach((url, index) => {
      const id = Math.random().toString(36).substr(2, 9);
      lastId = id;
      const position: [number, number, number] = [
        (this.models.length + index) * 2, // Space models along the X-axis
        0,
        0,
      ];
      this.models.push({
        id,
        url,
        position,
      });
    });

    // Select the last added model
    if (lastId) {
      this.selectModel(lastId);
    }
  }

  updateModelPosition(id: string, position: [number, number, number]) {
    const model = this.models.find((m) => m.id === id);
    if (model) {
      model.position = position;
    }
  }

  selectModel(id: string | null) {
    // Simply set the selectedModelId to the new id or null
    this.selectedModelId = id;
    
    // If we're currently dragging and selection changes, end the drag
    if (this.isDragging) {
      this.endDragging();
    }
  }

  isSelected(id: string) {
    return this.selectedModelId === id;
  }

  removeModel(id: string) {
    this.models = this.models.filter((m) => m.id !== id);
    
    // If we're removing the selected model, clear the selection
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

  // Get the selected model object
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