import * as THREE from 'three';
import React, { useCallback, useEffect} from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import {colorDefault, colorDaltonic, colorSequential, colorDivergent} from './colors';
import { Paper, Typography } from '@mui/material';
import theme from '../../../Theme/Theme';



const ThreeScene = ({ apiData }) => {

  const [divRef, setDivRef] = React.useState();
  const [colorLegendData, setColorLegendData] = React.useState([]);




  const refChangeHandler = (sceneRef) => {
    if (!sceneRef) return;
    setDivRef(sceneRef);
  }

  const createScene = useCallback(async (sceneRef, data) => {
    console.log(data);

    // scene
    const scene = new THREE.Scene();

    scene.background = new THREE.Color( 0xffffff );
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
    camera.setFocalLength( 18 );

    // renderer
    const renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
    sceneRef.appendChild(renderer.domElement);

    const width = sceneRef.clientWidth;

    const height = width * (window.innerHeight / window.innerWidth);
    renderer.setSize(width, height);
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.domElement.id = 'scene';


    camera.position.z = data.vol_relativo * 2/3;



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

    let model;
    let volumen_total;
    let new_color;


    async function loadModel() {
      try {
        // Load the GLTF file

        // Extract the GLTF file content from the response data
        const gltfContent = data.file_content;

        // Convert the base64-encoded GLTF content back to binary
        const gltfData = atob(gltfContent);
        const arrayBuffer = new ArrayBuffer(gltfData.length);
        const uintArray = new Uint8Array(arrayBuffer);

        // Copy the binary data into the Uint8Array
        for (let i = 0; i < gltfData.length; i++) {
          uintArray[i] = gltfData.charCodeAt(i);
        }

        const loader = new GLTFLoader();
        const gltf = await new Promise((resolve, reject) => {
          loader.parse(
            arrayBuffer,
            '',  // Path for additional resources
            resolve,
            reject
          );
        });

        // Process the loaded model (gltf object)
        scene.add(gltf.scene);
        return gltf.scene;



      } catch (error) {
        // Handle any errors that occur during the fetch or parsing
        console.error('Error loading file:', error);
      }
    }

    model = await loadModel();
    if (model) {
      model.scale.set(0.5, 0.5, 0.5);
      defaultColors(colorDefault, true);
      volumen_total = model.getObjectByName("Volumen_Total")
      volumen_total.material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true, opacity: 0.1} );
      showVolumen_relativo(false);
      createGui();


    }




    function showVolumen_relativo( visibility ) {
      if (model) {
        for (var i = 0; i < model.children.length; i++) {
          for (var j = 0; j < model.children[i].children.length; j++) {
            if (model.children[i].children[j].name.includes("model_volumen_relativo")) {
              model.children[i].children[j].visible = visibility;
              model.children[i].children[j].material = volume_material;

            }}}}}


    function showVolumen_total( visibility ) {
      volumen_total.visible = visibility;
    }

    function defaultColors(colorDict, newColor) {
      setColorLegendData(prevData => {
        const updatedData = [...prevData];

        for (let i = 0; i < data.variables.length; i++) {
          const variable = data.variables[i];

          if (!updatedData.some(item => item.id === variable)) {
            updatedData.push({
              id: variable,
              color: colorDict[i],
              text: variable
            });
          }

          for (let j = 0; j < data.samples.length; j++) {
            const parent = model.getObjectByName(data.samples[j]);

            if (parent) {
              parent.material = volume_material;

              for (let k = 0; k < parent.children.length; k++) {
                console.log(variable)

                if (parent.children[k].name.includes(variable)) {
                  parent.children[k].visible = true;

                  const color = newColor ? colorDict[i] : new THREE.Color(Math.random() * 0xffffff);
                  parent.children[k].material = new THREE.MeshBasicMaterial({
                    color,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.8
                  });
                }
              }
            }
          }
        }

        return updatedData;
      });
    }
    function distribuir(visibility){
      const size = 10
      const slicedArr = [];

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
              controls.reset();
              camera.position.set(0, 0, 1000);

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
      element.domElement.style.setProperty('font-size', '12px');
      element.domElement.style.setProperty('color', theme.palette.text.primary);
      element.domElement.style.setProperty('background-color', theme.palette.background.default);
      element.domElement.style.setProperty('border-radius', '5px');
      element.domElement.style.setProperty('border', '1px solid #ccc');
      element.domElement.style.setProperty('padding', '10px');
      element.domElement.style.setProperty('overflow', 'auto');
      element.domElement.style.setProperty('max-height', '100vh');
      element.domElement.style.setProperty('max-width', '300px');
      element.domElement.style.setProperty('z-index', '1000');



    }

    function createGui() {

      const gui = new GUI();
      sceneRef.appendChild(gui.domElement);

      gui.domElement.id = 'gui';
      gui.domElement.style.setProperty('position', 'absolute');
      gui.domElement.style.setProperty('top', '0');



      const settings = {
        'Elegir Muestra': "Todos",
        "Mostrar Volumen": true,
        "Mostrar Volumen Total": true,
        "Mostrar Datos": true,
        "Colores por Default": "Default",
        "Distribuir": false,
        "Cargar todas las muestras" : false,
        "Mostrar Leyenda": true,


      }

      const folder1 = gui.addFolder( 'Muestras' );
      folder1.add(settings, 'Elegir Muestra', data.samples).onChange(function(value) {
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
            }
          }}
      });
      folder1.add(settings, 'Mostrar Volumen').onChange( showVolumen_relativo );
      folder1.add(settings, 'Mostrar Volumen Total').onChange( showVolumen_total );
      folder1.add(settings, 'Distribuir').onChange( distribuir );
      // folder1.add(settings, 'Cargar todas las muestras').onChange( showAll );


      const folder2 = gui.addFolder( 'Materiales' );
      folder2.add(settings, 'Colores por Default', ["Default", "Daltonismo", "Secuencia", "Divergente"]).onChange( function(value) {
        new_color = false;
        if (value === "Default") {
          defaultColors(colorDefault, new_color);
        } else if (value === "Daltonismo") {
          defaultColors(colorDaltonic, new_color);
        } else if (value === "Secuencia") {
          defaultColors(colorSequential, new_color);
        } else if (value === "Divergente") {
          defaultColors(colorDivergent, new_color);
        } else {
          defaultColors(colorDefault, new_color);
        }


      });
      const folder3 = gui.addFolder( 'Descripción' );


      folder3.add(settings, 'Elegir Variable', data.variables).onChange( function(value) {
        if (value === "Volumen") {
          showVolumen_relativo(true);
          showVolumen_total(false);
        } else if (value === "Volumen Total") {
          showVolumen_relativo(false);
          showVolumen_total(true);
        } else {
          showVolumen_relativo(false);
          showVolumen_total(false);
        }
      });

      guiStyle(gui)
      guiStyle(folder1);
      guiStyle(folder2);
      guiStyle(folder3);






    }
    window.addEventListener('mousemove', onMouseMove);
    const raycaster = new THREE.Raycaster();


    function onMouseMove(event) {
      if (!model) return;
      const pointer = new THREE.Vector2();
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      // eslint-disable-next-line no-unused-vars
      const intersects = raycaster.intersectObjects(scene.children, true);
      // loop through all the intersected objects
      // for (let i = 0; i < intersects.length; i++) {
      //   const object = intersects[i].object;
      //   for (let j = 0; j < data.variables.length; j++) {
      //     if (object.name.includes(data.variables[j])) {
      //     }

      //   }
      // }
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
  }, []);
  useEffect(() => {
    if (!apiData || !divRef) return;


    createScene(divRef, apiData);

  }, [apiData, divRef, createScene]);

  return (
    <>
      <Paper id='canvas' ref={refChangeHandler} elevation={3} sx={{ p: 2, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'row' }}>
          <Paper id='leyenda' elevation={0} sx={{ marginBottom: '10px' }}>
            {colorLegendData.map((item) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '5px'}}>
                <div style={{ backgroundColor: item.color, width: '10px', height: '10px', borderRadius: '50%' }} id={item.id}></div>
                <Typography variant="body2" sx={{ fontSize: '12px' }}>
                  {item.text}
                </Typography>
              </div>
            ))}
          </Paper>
      </Paper>
      {/* Rest of the JSX */}
    </>
  );
};

export default ThreeScene;
