import { computed, makeAutoObservable, action, runInAction } from "mobx";
import * as THREE from "three";

interface nodes {
  id: string;
  modelId: string;
  start: [number, number, number];
  end: [number, number, number];
  center: [number, number, number];
}
interface models {
  id: string;
  gltfId?: string;
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  group: THREE.Group[];
  scale: [number, number, number];
}
class ConfiguratorStore {
  models: Array<models> = [];
  selectedModelId: string | null = null;
  viewMode: "2D" | "3D" = "2D";
  nodes: Array<nodes> = [];
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

  setViewMode(mode: "2D" | "3D") {
    this.viewMode = mode;
  }

  addModel(url: string, position: [number, number, number], gltfId?: string) {
    const id = Math.random().toString(36).substr(2, 9);
    const rotation: [number, number, number] = [0, 0, 0];
    const scale: [number, number, number] = [1, 1, 1];
    this.models.push({
      id,
      url,
      position,
      rotation,
      group: [],
      gltfId,
      scale,
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
    console.log(modelNodes);
    const model = this.models.find(m => m.id === modelId);
    
    if (!model || modelNodes.length === 0) {
        return;
    }

    // Compute scale factors
    const scaleFactorX = newScale[0] / model.scale[0];
    const scaleFactorY = newScale[1] / model.scale[1];
    const scaleFactorZ = newScale[2] / model.scale[2];

    if (scaleFactorX === 1 && scaleFactorY === 1 && scaleFactorZ === 1) return;

    // Scaling matrix
    const scaleMatrix = new THREE.Matrix4().makeScale(scaleFactorX, scaleFactorY, scaleFactorZ);

    // Use world position instead of local if possible
    const modelCenter = new THREE.Vector3(model.position[0], model.position[1], model.position[2]);

    modelNodes.forEach(node => {

        const startRelative = new THREE.Vector3().fromArray(node.start);
        const endRelative = new THREE.Vector3().fromArray(node.end);

        startRelative.applyMatrix4(scaleMatrix);
        endRelative.applyMatrix4(scaleMatrix);

        const newStart = startRelative;
        const newEnd = endRelative;
        const newCenter = new THREE.Vector3().addVectors(newStart, newEnd).multiplyScalar(0.5);

        node.start = [newStart.x, newStart.y, newStart.z];
        node.end = [newEnd.x, newEnd.y, newEnd.z];
        node.center = [newCenter.x, newCenter.y, newCenter.z];
    });

}


  setModelScale(id: string, scale: [number, number, number]) {
    const model = this.models.find((m) => m.id === id);
    if (model) {
      this.updateNodesOnScaling(id, scale);
      model.scale = scale;
      // model.group[0].scale.set(scale[0], scale[1], scale[2])
    }
  }

  addModelToGroup(id: string, mesh: THREE.Group) {
    const model = this.models.find((m) => m.id === id);
    if (model) {
      model.group.push(mesh);
    }
  }

  updateExternalTexture(id: string, texture: THREE.Texture) {
    const model = this.models.find((m) => m.id === id);
    if (model) {
      model.group.forEach((mesh) => {
        if (mesh.name.includes("External")) {
          mesh.material.map = texture;
        }
      });
    }
  }

  updateInternalTexture(id: string, texture: THREE.Texture) {
    const model = this.models.find((m) => m.id === id);
    if (model) {
      model.group.forEach((mesh) => {
        if (!mesh.name.includes("Internal")) {
          mesh.material.map = texture;
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
    
    // Update each node's position
    modelNodes.forEach(node => {
      const start = new THREE.Vector3(
        node.start[0],
        node.start[1],
        node.start[2]
      );
      
      const end = new THREE.Vector3(
        node.end[0],
        node.end[1],
        node.end[2]
      );
      
      start.applyMatrix4(rotationMatrix);
      end.applyMatrix4(rotationMatrix);
      
      const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      
      node.start = [start.x, start.y, start.z];
      node.end = [end.x, end.y, end.z];
      node.center = [center.x, center.y, center.z];
    });
  }
  updateModelRotation(id: string, yRotation: number) {
    const model = this.models.find((m) => m.id === id);
    if (model) {
      this.updateNodesOnRotation(id, yRotation);
      model.rotation[1] = yRotation;
      // Update node positions to match the new rotation
    }
  }

  updateModelPosition(id: string, position: [number, number, number]) {
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

    return true; // Successfully started dragging
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
  
    const threshold = 1; // Distance within which nodes should snap
    let snapped = false;
  
    for (let currentNode of currentNodes) {
      const currentCenter = new THREE.Vector3(
        currentNode.center[0] + newPosition.x,
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
  
        if (currentCenter.distanceTo(otherCenter) < threshold) {
          if (this.checkModelOverlap(currentModel, otherStartModel)) {
            continue;
          }
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

  setNodes(modelId: string, start: [number, number, number], end: [number, number, number], center: [number, number, number]) {
    const existingNode = this.nodes.find(node => 
        node.modelId === modelId && 
        node.center[0] === center[0] && 
        node.center[1] === center[1] && 
        node.center[2] === center[2]
    );

    if (existingNode) return; // Avoid duplicate nodes

    const id: string = Math.random().toString(36).substr(2, 9);
    this.nodes.push({ id, modelId, start, end, center });
    console.log(this.nodes)

}


}

const store = new ConfiguratorStore();
export default store;
