import * as THREE from 'three';
import React from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import modelo from './modelo.glb';
import { CSS2DRenderer , CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MuiGui } from '../components/theme/MuiGui/MuiGui';
import Typography from '@mui/material/Typography';
import { createRoot } from 'react-dom/client';




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


    const p = document.createElement("p");
    const root = createRoot(p);
    const typography = (text) => (
      <Typography variant="body2">
        {text}
      </Typography>
    );

    const pContainer = document.createElement("div");
    pContainer.appendChild(p);
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
        defaultColors(colorDefault);
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
    function defaultColors (color_dict) {
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
                if (color_dict.hasOwnProperty(j)) {
                  var color = new THREE.Color( color_dict[j]);
                } else {
                  color = new THREE.Color( Math.random() * 0xffffff );
                }
                parent.children[k].material = new THREE.MeshBasicMaterial( { color: color, wireframe: true, transparent: true, opacity: 0.8});
              }
            }}}}}

    function showData( model ) {
      root.render(typography(model.name), p);
      p.visible = true;
      cPointLabel.visible = true;
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
        "Colores por Default": "Default",
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
      folder2.add(settings, 'Colores por Default', ["Default", "Daltonismo", "Secuencia", "Divergente"]).onChange( function(value) {
        if (value === "Default") {
          defaultColors(colorDefault);
        } else if (value === "Daltonismo") {
          defaultColors(colorDaltonic);
        } else if (value === "Secuencia") {
          defaultColors(colorSequential);
        } else if (value === "Divergente") {
          defaultColors(colorDivergent);
        } else {
          defaultColors(colorDefault);
        }


      });


    return (
      <MuiGui variant="contained">
      {folder1}
      {/* add additional folders and components here */}
    </MuiGui>
    );

    }

    const colorDefault = [
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
    const colorDaltonic = [
      0xffffb3,
      0x8dd3c7,
      0xbebada,
      0xfb8072,
      0x80b1d3,
      0xfdb462,
      0xb3de69,
      0xfccde5,
      0xd9d9d9,
      0xbc80bd,
      0xccebc5,
      0xffed6f,
      0xa65628,
      0xe6f5d0,
      0x1f78b4
    ];
    const colorSequential = [
      0xeff8e9,
      0xc7e9c0,
      0xa1d99b,
      0x74c476,
      0x41ab5d,
      0x238b45,
      0x006d2c,
      0x005a20,
      0x00441b,
      0x003816,
      0x002c10,
      0x00220b,
      0x001a08,
      0x001206,
      0x000a03
    ];
    const colorDivergent= [
      0x4d4d4d,
      0x5da5da,
      0xfaa43a,
      0x60bd68,
      0xf17cb0,
      0xb2912f,
      0xb276b2,
      0xdecf3f,
      0xf15854,
      0x4c72b0,
      0x76b7b2,
      0xffa8a8,
      0xa6daff,
      0xffd1a8,
      0xb1c1c0
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
  return <div ref={refChangeHandler} id='container'><div id="gui">{GUI.domElement}</div></div>;
};


export default ThreeScene;
