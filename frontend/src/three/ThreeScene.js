import * as THREE from 'three';
import React from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import modelo from './modelo.glb';
import { CSS2DRenderer , CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';




const ThreeScene = ({ data }) => {
  const refChangeHandler = (sceneRef) => {
    // doc
    if (!sceneRef) return;
    const container = sceneRef
    const list = [];


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

    camera.position.z = 5;

    // lights
    const light = new THREE.PointLight(0xffffff, 1000, 2000);
    const ambientLight = new THREE.AmbientLight( 0xffffff );
    scene.add( ambientLight );
    light.position.set(0, 0, 0);
    scene.add(light);
    scene.add( new THREE.AxesHelper( 20 ) );

    // controls
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 0, 0 );
    controls.dynamicDampingFactor = 0.3;
    controls.minDistance = 0;
    controls.maxDistance = 300;
    controls.update();

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize( window.innerWidth, window.innerHeight );
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.pointerEvents = 'none';
    labelRenderer.domElement.style.top = '0px';
    container.appendChild( labelRenderer.domElement );



    const volume_material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true, opacity: 0.1} )


    var model;

    const p0 = document.createElement("p");
    const p = document.createElement("p");
    const pContainer = document.createElement("div");
    pContainer.appendChild(p);
    pContainer.appendChild(p0);
    const cPointLabel = new CSS2DObject(pContainer);
    scene.add(cPointLabel);
    cPointLabel.visible = false;
    p.visible = false;


    const loader = new GLTFLoader();
    loader.load(modelo, function (gltf) {
        model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);

        for (let i = 0; i < model.children.length; i++) {

          const blue = data.model.samples[i]?.colors[0];
          const red = data.model.samples[i]?.colors[1];

          if (!blue || !red) {
            model.children[i].material = volume_material
            continue;
          }
          if (blue && red) {

            const color_blue = parseInt(blue * 1000).toString().slice(0, 2);
            const color_red = parseInt(red * 1000).toString().slice(0, 2);
            console.log(color_blue, color_red)
            const material10 = new THREE.MeshStandardMaterial( {roughness: 0.0198, metalness: 1} );

            material10.color = new THREE.Color(0x000000);
            material10.color.setRGB(color_red, 0, 0);
            material10.emissive.setRGB(0, 0, color_blue);

            model.children[i].material = material10;


            if (!list.includes(model.children[i].name)) {
              console.log("nombre",model.children[i].name);
              list.push(model.children[i].name);
              }
        }
      }
        list.push("Todos");
        createGui(list);
        scene.add(model);
      }, undefined, function (error) {
        console.error(error);
      });

    function showVolumen( visibility ) {
        model.getObjectByName("Volumen").visible = visibility;
    }
    function showData( model ) {
      for (let muestra of data.model.samples) {
        if (model.userData.name === muestra.name) {
          console.log("muestra", muestra)
          p.textContent = muestra.variables
          p.textContent = `Nombre Muestra: ${model.name}`;
          p0.textContent = `Clorofila A: (${muestra.colors[0]}) Clorofila B: (${muestra.colors[1]})`
      }
    }

      p.visible = true;
      cPointLabel.visible = true;


    }
    function createGui( list ) {

      const gui = new GUI();
      gui.domElement.id = "gui";
      const folder1 = gui.addFolder( 'Muestras' );
      const settings = {
        'Número de muestra': "Todos",
        "Mostrar Volumen": true,
        "Mostrar Datos": true

      }

      folder1.add(settings, 'Número de muestra', list).onChange(function(value) {
        for (let i = 0; i < model.children.length; i++) {
          model.children[i].visible = false;
        }
        while (value === "Todos") {
          for (let i = 0; i < model.children.length; i++) {
            model.children[i].visible = true;
          }
          return;
        }
        const index = list.indexOf(value);
        const selected_model = model.getObjectByName(value, index)
        model.getObjectByName("Volumen").visible = true;
        selected_model.visible = true;
        console.log(selected_model);
        showData(selected_model);


    } );
    folder1.add(settings, 'Mostrar Volumen').onChange( showVolumen );


    }









    // animate
    function animate() {
      requestAnimationFrame( animate );

      if (model) {
        model.rotation.x += 0.001;
        model.rotation.y += 0.001;
      }
      light.position.copy(camera.position);
      controls.update();
      renderer.render( scene, camera );
      labelRenderer.render( scene, camera );
    }
    animate();

  };
  return <div ref={refChangeHandler} id='container' />;
};

export default ThreeScene;
