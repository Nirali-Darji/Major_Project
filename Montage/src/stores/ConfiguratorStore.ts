import { computed, makeAutoObservable } from "mobx";

class ConfiguratorStore {
  models: Array<{ id: string; url: string; position: [number, number, number] }> = [];
  selectedModelIds: Set<string> = new Set();
  viewMode: '2D' | '3D' = '2D';

  constructor() {
    makeAutoObservable(this, {
      selectedModels: computed,
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
    const newIds: string[] = [];

    urls.forEach((url, index) => {
      const id = Math.random().toString(36).substr(2, 9);
      newIds.push(id);
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

    // Clear previous selection and select all new models
    this.selectedModelIds.clear();
    newIds.forEach((id) => this.selectedModelIds.add(id));
  }
  

  updateModelPosition(id: string, position: [number, number, number]) {
    const model = this.models.find((m) => m.id === id);
    if (model) {
      model.position = position;
    }
  }

  selectModel(id: string | null) {
    if (id === null) {
      this.selectedModelIds.clear();
      return;
    }

    // Toggle selection (multi-select is always enabled)
    if (this.selectedModelIds.has(id)) {
      this.selectedModelIds.delete(id);
    } else {
      this.selectedModelIds.add(id);
    }
  }

  isSelected(id: string) {
    return this.selectedModelIds.has(id);
  }

  removeModel(id: string) {
    this.models = this.models.filter((m) => m.id !== id);
    this.selectedModelIds.delete(id);
  }

  removeSelectedModels() {
    this.models = this.models.filter((m) => !this.selectedModelIds.has(m.id));
    this.selectedModelIds.clear();
  }

  // Get array of selected model objects
  get selectedModels() {
    return this.models.filter((m) => this.selectedModelIds.has(m.id));
  }
}

const store = new ConfiguratorStore();
export default store;