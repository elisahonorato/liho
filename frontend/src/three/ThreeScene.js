import * as THREE from 'three';
import React, { useEffect, useRef} from 'react';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import file from './file.glb';

const ThreeScene = ({ data }) => {

  const sceneRef = useRef();

  useEffect(() => {

    // doc
    const container = sceneRef.current


    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

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
      const color = new THREE.Color();
      for (let i = 0; i < model.children.length; i++) {
        const material = new THREE.MeshStandardMaterial({
          color: color.setRGB(Math.random(), Math.random(), Math.random()),
          metalness: 0.5,
          roughness: 0.5,
          transparent: true,
          opacity: 0.7,
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
        model.rotation.x += 0.01;
        model.rotation.y += 0.01;
      }
      light.position.copy(camera.position);
      controls.update();
      renderer.render( scene, camera );
    }

    animate();

    },
    [data]);
    return <div ref={sceneRef} id='container' />;
  };

  export default ThreeScene;
