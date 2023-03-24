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

    // environment
    const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 100 );
    camera.position.set( - 1, 0, 0 ).normalize().multiplyScalar( 10 );
    camera.setFocalLength( 50 );
    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );

    // renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

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
    const model = new THREE.Group();
    scene.add(model);



    const loader = new GLTFLoader();
    loader.load(file, function (gltf) {
      // Aca ocurre la magia de blender
      const model = gltf.scene;
      const color = new THREE.Color();
      for (let i = 0; i < model.children.length; i++) {
        const material = new THREE.MeshStandardMaterial({
          color: color.setRGB(Math.random(), Math.random(), Math.random()),
          metalness: 1,
          roughness: 0.5,
          transparent: true,
          opacity: 0.5,
          envMapIntensity: 1

        });
        model.children[i].material = material;
        render();

      }
      scene.add(model);

    },  undefined, function (e) {
      console.error(e);

    });

    // Add the scene to the Three.js renderer

    // Render the scene
    const render = function (){
      requestAnimationFrame(render);
      renderer.render(scene, camera);
      light.position.copy(camera.position);
      controls.update();
    }
    render();
  },


   [data]);


  return <div ref={sceneRef} id='container' />;
};

export default ThreeScene;

