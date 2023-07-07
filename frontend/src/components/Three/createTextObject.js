import FontData from './Alegreya Sans Medium_Regular.json';
import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';



function createTextObject( text = '', fontSize = 10, color = 0x000000) {
  console.log('createTextObject');
  const font = new FontLoader().parse(FontData);
  const geometry = new TextGeometry(text, {
    font: font,
    size: fontSize,
    height: 0.1,
  }
  );
  const material = new THREE.MeshBasicMaterial({ color: color });
  const Typography = new THREE.Mesh(geometry, material);
  Typography.position.set(0, 0, 0);
  console.log(Typography);

  return Typography;
}

export default createTextObject;
