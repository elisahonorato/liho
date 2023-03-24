import * as THREE from 'three';
import React, { useEffect, useRef} from 'react';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import file from './file.glb';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { getRandomColorArray } from './RandomColorArray';

const ThreeScene = ({ data }) => {

  const sceneRef = useRef();

  useEffect(() => {

    // doc
    const container = sceneRef.current


    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.setFocalLength( 18 );

    // renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    container.appendChild( renderer.domElement );

    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    camera.position.z = 5;

    // lights
    const light = new THREE.PointLight(0xffffff, 1, 50);
    const ambientLight = new THREE.AmbientLight( 0x222222 );
    scene.add( ambientLight );
    light.position.set(0, 0, 0);
    scene.add(light);
    scene.add( new THREE.AxesHelper( 20 ) );

    // controls
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 0, 0 );
    controls.dynamicDampingFactor = 0.3;
    controls.minDistance = 1;
    controls.maxDistance = 100;
    controls.update();

    let model;


    const loader = new GLTFLoader();

    loader.load(file, function (gltf) {
      model = gltf.scene;
      const colorArray = getRandomColorArray(model.children.length);
      const color = new THREE.Color();
      for (let i = 0; i < model.children.length ; i++) {
        const component = colorArray[i];
        const material = new THREE.MeshStandardMaterial({
          color: color.setRGB(component[0]*0.01, component[1]*0.01, component[2]*0.01),
          metalness: 0.5,
          roughness: 0.9,
          transparent: true,
          opacity: 0.6,
          fog: true,
          depthWrite: true,
          depthTest: true,
          side: THREE.DoubleSide,

        });
        model.children[i].material = material;
      }
      scene.add(model);

    }, undefined, function (error) {
      console.error(error);
    });
    console.log(model);

    function animate() {
      requestAnimationFrame( animate );
      if (model){
        model.rotation.x += 0.007;
        model.rotation.y += 0.007;
      }
      light.position.copy(camera.position);
      controls.update();
      renderer.render( scene, camera );
    }
    function getRndInteger(min, max) {
      return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
    function getRandomColor(min, max) {
      const r = Math.floor(Math.random() * (max/2 - min + 1) ) + min;
      const g = Math.random();
      const b = Math.random();
      const components = [r, g, b];
      components.sort(() => Math.random() - 0.5);
      return new THREE.Color(components[0], components[1], components[2]);
    }

    animate();

    },
    [data]);
    return <div ref={sceneRef} id='container' />;
  };

  export default ThreeScene;
