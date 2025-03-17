import * as THREE from "three";

const loadTexture = (url) => {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous"; 
    loader.load(
      url,
      (texture) => resolve(texture), // Successfully loaded
      undefined, // Progress callback (optional)
      (error) => reject(error) // Error callback
    );
  });
};

export default loadTexture;
