import * as THREE from 'three';
import React from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import modelo from './modelo.glb';
import { CSS2DRenderer , CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';





const ThreeScene = ({ data }) => {

  const refChangeHandler = (sceneRef) => {
    if (!sceneRef) return;
    const container = sceneRef
    const list = [];


    // scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
    camera.setFocalLength( 18 );

    // renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    container.appendChild( renderer.domElement );

    camera.position.z = data.vol * 2/3;

    // lights
    const light = new THREE.PointLight(0xfffff0, 1000, 2000);
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
    controls.maxDistance = 1500;
    controls.update();

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize( window.innerWidth, window.innerHeight );
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.pointerEvents = 'none';
    labelRenderer.domElement.style.top = '0px';
    container.appendChild( labelRenderer.domElement );


    const volume_material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true, opacity: 0.2} )


    const p0 = document.createElement("p");
    const p = document.createElement("p");
    const pContainer = document.createElement("div");
    pContainer.appendChild(p);
    pContainer.appendChild(p0);
    const cPointLabel = new CSS2DObject(pContainer);
    scene.add(cPointLabel);
    cPointLabel.visible = false;
    p.visible = false;

    let model;
    let volumen_relativo;
    let volumen_total;




    const loader = new GLTFLoader();
    loader.load(modelo, function (gltf) {
        model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);
        defaultColors();
        volumen_relativo = model.getObjectByName("Volumen")
        volumen_relativo.material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true, opacity: 0.1} );
        volumen_total = model.getObjectByName("Volumen_Total")
        volumen_total.material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true, opacity: 0.1} );

        list.push("Todos");
        createGui(list);

        scene.add(model);

      }, undefined, function (error) {
        console.error(error);
      });

    function showVolumen_relativo( visibility ) {
      volumen_relativo.visible = visibility;
    }
    function showVolumen_total( visibility ) {
      volumen_total.visible = visibility;
    }
    function defaultColors() {
      for (let i = 0; i < data.samples.length; i++) {
        list.push(data.samples[i]);
        // Obtener Muestra
        const parent = model.getObjectByName(data.samples[i]);
        if (parent) {
          parent.material = volume_material;
          // Obtener Variables
          for (let j = 0; j < data.variables.length; j++) {
            for(let k = 0; k < parent.children.length; k++) {
              if (parent.children[k].name.includes(data.variables[j])) {
                console.log(parent.children[k].name);
                parent.children[k].visible = true;
                if (colorSamples.hasOwnProperty(j)) {
                  var color = new THREE.Color( colorSamples[j]);
                } else {
                  color = new THREE.Color( Math.random() * 0xffffff );
                }
                parent.children[k].material = new THREE.MeshBasicMaterial( { color: color, wireframe: true, transparent: true, opacity: 0.8});
              }
            }}}}}

    function showData( model ) {
      p.textContent = model.userData.name;
      p.visible = true;
      cPointLabel.visible = true;
      p0.textContent = model.children.name
      p0.visible = true;
    }

    function distribuir(visibility){
      for (let i = 0; i < data.samples.length; i++) {
        const parent = model.getObjectByName(data.samples[i]);
        if (visibility) {
          parent.position.x = i * data.vol * 3;
        } else {
          parent.position.x = 0;
        }}}

    function createGui( list ) {

      const gui = new GUI();
      gui.domElement.id = "gui";
      const folder1 = gui.addFolder( 'Muestras' );
      const settings = {
        'Elegir Muestra': "Todos",
        "Mostrar Volumen": true,
        "Mostrar Volumen Total": true,
        "Mostrar Datos": true,
        "Elegir Variable": data.variables[0],
        "Colores por Default": false,
        "Distribuir": false

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
      folder1.add(settings, 'Mostrar Volumen').onChange( showVolumen_relativo );
      folder1.add(settings, 'Mostrar Volumen Total').onChange( showVolumen_total );
      folder1.add(settings, 'Distribuir').onChange( distribuir );



      const values = [];
      const folder2 = gui.addFolder( 'Materiales' );
      folder2.add(settings, 'Colores por Default').onChange( defaultColors );
      folder2.add(settings, 'Elegir Variable', data.variables).onChange( function(value) {
        if (!values.includes(value)) {
          var index = data.variables.indexOf(value);
          var material2 = new THREE.MeshBasicMaterial( { color: colorSamples[index], wireframe: true, transparent: true, opacity: 0.5} );
          folder2.addColor(material2, 'color').name(value).onChange(function(color) {
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

    const colorSamples = [
      0xff0000,   // red
      0x98da1f,   // light green
      0x147df5,   // blue
      0xffff00,   // yellow
      0xff8700,   // orange
      0xbe0aff,   // light purple
      0x0aefff,   // light blue
      0x136a7a2,  // turquoise
      0x580aff,   // purple
      0xd283ff,   // light pink
      0xff6176,   // light magenta
      0xc0d7503,  // dark green
      0x0b525b,   // petroleum
      0xe56b6f,   // salmon
      0xFA69FF,   // ultra pink
      0x9cf945,   // lime
      0x6E69FF,   // purple
      // these colors can be found on https://coolors.co/palette/ff0000-ff8700-ffd300-deff0a-a1ff0a-0aff99-0aefff-147df5-580aff-be0aff




    ];





    // animate
    function animate() {
      requestAnimationFrame( animate );

      if (model) {
          model.rotation.x += 0.0001;
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
