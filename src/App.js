import logo from './logo.svg';
import About from './component/About';
import './App.css';
import React from 'react';
import { useEffect } from 'react';
import * as THREE from 'three';


function Canvas() {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 96;
    const canvas = document.getElementById('Threejs')
    const renderer = new THREE.WebGLRenderer({canvas, antialias:true,})
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    ambientLight.castShadow = true;
    scene.add( ambientLight );

    const spotLight = new THREE.SpotLight(0xffffff, 0.5);
    spotLight.position.set(0, 64, 32);
    spotLight.castShadow = true;
    scene.add( spotLight );

    const boxGeometry = new THREE.BoxGeometry(16,16,16)
    const boxMaterial = new THREE.MeshNormalMaterial();
    const boxMesh = new THREE.Mesh(boxGeometry,boxMaterial);
    scene.add(boxMesh);

    const animate = () => {
      renderer.render(scene, camera);
      window.requestAnimationFrame(animate);
    };
    animate();
  }, []);
}
  function App() {
  return (
    <div className="App">
      <div><canvas id="Threejs"><Canvas></Canvas></canvas></div>
      <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
        <About></About>
      </header>
  
    </div>
  );
}
export default App;

