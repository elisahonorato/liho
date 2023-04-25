import * as THREE from 'three';
import React from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import modelo from './modelo.glb';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MuiGui } from '../components/theme/MuiGui/MuiGui';
import Typography from '@mui/material/Typography';
import ReactDOM from 'react-dom';
import {colorDefault, colorDaltonic, colorSequential, colorDivergent} from './colors';
import theme from '../components/theme';



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
    const canvas = document.getElementById('canvas');
    const canvas_container = document.getElementById('canvas_container');
    const width = canvas.clientWidth;
    const height = width * (window.innerHeight / window.innerWidth);
    renderer.setSize(width, height);
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    container.appendChild( renderer.domElement );


    camera.position.z = data.vol_relativo * 2/3;

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


    const volume_material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true, opacity: 0.1} )




    const Typography_text = (text) => (
      <Typography id= "texto" variant="body2">
        {text}
      </Typography>
    );
    const texto = document.getElementById("texto");

    let model;
    let volumen_relativo;
    let volumen_total;



    const loader = new GLTFLoader();
    loader.load(modelo, function (gltf) {
        model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);
        defaultColors(colorDefault);
        volumen_total = model.getObjectByName("Volumen_Total")
        volumen_total.material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true, opacity: 0.1} );
        showVolumen_relativo(false);

        list.push("Todos");
        createGui(list);

        scene.add(model);

      }, undefined, function (error) {
        console.error(error);
      });

    function showVolumen_relativo( visibility ) {
      if (model) {
        for (var i = 0; i < model.children.length; i++) {
          for (var j = 0; j < model.children[i].children.length; j++) {
            if (model.children[i].children[j].name.includes("model_volumen_relativo")) {
              modelo = model.children[i].children[j];
              modelo.visible = visibility;
              modelo.material = volume_material;

            }
          }
        }}
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
      const string = "Muestra: " + model.name;
      texto.innerHTML = string;

    }
    function distribuir(visibility){
      const size = 5
      const slicedArr = [];
      console.log(data.vol_total);

      const grid_width = [-500, -250, 0, 250, 500];
      for (let i = 0; i < data.samples.length; i += size) {
        const chunk = data.samples.slice(i, i + size);
        slicedArr.push(chunk);
      }
      for (let i = 0; i < slicedArr.length; i++) {
        for (let j = 0; j < slicedArr[i].length; j++) {
          const parent = model.getObjectByName(slicedArr[i][j]);
          if (parent) {
            if (visibility) {
              parent.position.set(grid_width[i], grid_width[j], 0);

            }
            else {
              parent.position.set(0, 0, 0);
            }

          }
        }
      }
      showVolumen_relativo(visibility);
      showVolumen_total(false);

    }
    function guiStyle(element) {
      element.domElement.style.setProperty('font-family', theme.typography.fontFamily);
      element.domElement.style.setProperty('font-size', `${theme.typography.fontSize}px`);
      element.domElement.style.setProperty('font-weight', theme.typography.fontWeightRegular);
      element.domElement.style.setProperty('line-height', 'normal');
      element.domElement.style.setProperty('background-color', theme.palette.background.paper);
      element.domElement.style.setProperty('color', theme.palette.text.primary);
      element.domElement.style.setProperty('border-radius', theme.shape.borderRadius);
      element.domElement.querySelector('.title').style.setProperty('background-color', theme.palette.background.paper);
      element.domElement.querySelector('.title').style.setProperty('color', theme.palette.text.primary);
      element.domElement.querySelector('.title').style.setProperty('border-radius', theme.shape.borderRadius);
      element.domElement.querySelector('.display').style.setProperty('background-color', theme.palette.secondary.main);
      element.domElement.style.setProperty('padding', '0 14px');
    }


    function createGui( list ) {

      const gui = new GUI();
      canvas_container.appendChild(gui.domElement);
      gui.domElement.style.zIndex = "100000";
      gui.domElement.style.position = "absolute";


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
      guiStyle(gui)
      guiStyle(folder1);
      guiStyle(folder2);



    return (
      <MuiGui variant="contained">
      {folder1}
      {/* add additional folders and components here */}
    </MuiGui>
    );

    }



    // animate
    function animate() {
      requestAnimationFrame( animate );
      if (volumen_total) {
        volumen_total.rotation.x += 0.0001;
        volumen_total.rotation.y += 0.001;
        if (volumen_total.position.x > data.vol_relativo || volumen_total.position.y > data.vol_relativo) {
          volumen_total.rotation.x -= 0.001;
          volumen_total.rotation.y -= 0.001;
        }

      light.position.copy(camera.position);
      controls.update();
      renderer.render( scene, camera );
      }
    }

    animate();

  };
  return  <div ref={refChangeHandler}></div>;
};


export default ThreeScene;
