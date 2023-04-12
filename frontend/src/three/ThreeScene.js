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



    const volume_material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true, opacity: 0.2} )


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

        for (let i = 0; i < data.samples.length; i++) {
          list.push(data.samples[i]);
          const parent = model.getObjectByName(data.samples[i]);
          parent.material = volume_material;
          console.log(parent.children.length);
          for (let j = 0; j < parent.children.length; j++) {
            parent.children[j].visible = true;
            if (parent.children[j].name.includes(data.variables[1]) || parent.children[j].name.includes(data.variables[2])) {
              parent.children[j].material = new THREE.MeshBasicMaterial( { color: 0x0000ff, wireframe: true, transparent: true, opacity: 0.5} );
            }
            else {
              parent.children[j].material = new THREE.MeshBasicMaterial( { color: 0xfff000, wireframe: true, transparent: true, opacity: 0.5} );
            }

            console.log(data.variables)



            console.log("child",parent.children[j]);
          }

        }

        const volumen = model.getObjectByName("Volumen").material = volume_material;
        volumen.visible = true;
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
      p.textContent = model.userData.name;
      p.visible = true;
      cPointLabel.visible = true;


    }
    function createGui( list ) {

      const gui = new GUI();
      gui.domElement.id = "gui";
      const folder1 = gui.addFolder( 'Muestras' );
      const settings = {
        'Elegir Muestra': "Todos",
        "Mostrar Volumen": true,
        "Mostrar Datos": true,
        "Elegir Variable": data.variables[0],

      }
      folder1.add(settings, 'Elegir Muestra', list).onChange(function(value) {
        for (let i = 0; i < data.samples.length; i++) {
          if (value === "Todos") {
            const parent = model.getObjectByName(data.samples[i]);
            parent.visible = true;
          }
          else {
            const parent = model.getObjectByName(data.samples[i]);
            parent.visible = false;
            if (value === data.samples[i]) {
              parent.visible = true;
              showData(parent);
            }
          }}
      });
      folder1.add(settings, 'Mostrar Volumen').onChange( showVolumen );
      var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true, transparent: true, opacity: 0.5} );

      const values = [];
      const folder2 = gui.addFolder( 'Colores' );
      folder2.add(settings, 'Elegir Variable', data.variables).onChange( function(value) {
        if (!values.includes(value)) {

          folder2.addColor(material, 'color').name(value).onChange(function(color) {
            for (let i = 0; i < data.samples.length; i++) {
              const parent = model.getObjectByName(data.samples[i]);
              for (let j = 0; j < parent.children.length; j++) {
                if (parent.children[j].name.includes(value)) {
                  parent.children[j].material.color.set(color);
                }
              }
        }});
        values.push(value);
      }
    });

    }
    // animate
    function animate() {
      requestAnimationFrame( animate );

      if (model) {
          model.rotation.x += 0.001;
          model.rotation.y += 0.001;
          if (model.position.x > data.vol || model.position.y > data.vol) {
            model.rotation.x -= 0.001;
            model.rotation.y -= 0.001;
          }

      light.position.copy(camera.position);
      controls.update();
      renderer.render( scene, camera );
      labelRenderer.render( scene, camera );
      }
    }

    animate();

  };
  return <div ref={refChangeHandler} id='container' />;
};

export default ThreeScene;
