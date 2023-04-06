import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { getRandomColorArray } from './RandomColorArray'

const loadModel = (modelo, scene) => {
  let model;
  // Instantiate a loader
  const loader = new GLTFLoader();
  loader.load(modelo, function (gltf) {
    // Get the root object of the loaded model
    model = gltf.scene;
    // Set the model's initial scale
    const colorArray = getRandomColorArray(model.children.length);
    const color = new THREE.Color();
    for (let i = 0; i < model.children.length ; i++) {
      const component = colorArray[i];
      const material = new THREE.MeshStandardMaterial({
        color: color.setRGB(component[0]*0.01, component[1]*0.01, component[2]*0.01),
        transparent: true,
        opacity: 0.3,
      });
      model.children[i].material = material;
    }
    scene.add(model);
  }, undefined, function (error) {
    console.error(error);
  });

  // Return the loaded model
  return model;
}

export default loadModel;
