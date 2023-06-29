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
    if (!sceneRef) return;


    // scene
    const scene = new THREE.Scene();

    scene.background = new THREE.Color( 0xffffff );
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
    camera.setFocalLength( 18 );

    // renderer
    const renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
    refChangeHandler(sceneRef)
    if (sceneRef) {
      const canvasElements = sceneRef.getElementsByTagName('canvas');
      if (canvasElements.length > 0) {
        for (let i = 0; i < canvasElements.length; i++) {
          const canvasToRemove = canvasElements[i];
          sceneRef.removeChild(canvasToRemove);
        }
      }
    }


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
    

    async function loadModel() {
      try {
        // Load the GLTF file

        // Extract the GLTF file content from the response data
        const gltfContent = data.content;

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
        return gltf.scene;



      } catch (error) {
        // Handle any errors that occur during the fetch or parsing
        console.error('Error loading file:', error);
      }
    }
    model = await loadModel();
    if (model) {
      
      model.scale.set(0.5, 0.5, 0.5);
      setColorLegendData([])
     
      defaultColors(colorDefault);
      volumen_total = model.getObjectByName("Volumen_Total")
      volumen_total.material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true, opacity: 0.1} );
      showVolumen_relativo(false);
      showVolumen_total(false);
      createGui();
      model.position.set(0, 0, 0);
      model.visibility = true;

    
      scene.add(model);
    }
    
    



    function showVolumen_relativo( visibility ) {
      if (model !== undefined) {
        for (var i = 0; i < model.children.length; i++) {
          for (var j = 0; j < model.children[i].children.length; j++) {
            if (model.children[i].children[j].name.includes("model_volumen_relativo")) {
              model.children[i].children[j].visible = visibility;
              model.children[i].children[j].material = volume_material;

            }}}}}


    function showVolumen_total( visibility ) {
      volumen_total.visible = visibility;
    }

    function defaultColors(colorDict) {
    
      setColorLegendData(prevData => {
        const updatedData = [prevData];
    
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
                if (parent.children[k].name.includes(variable)) {
                  parent.children[k].visible = true;
    
                  const color = colorDict[i];
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
function setMuiStyles(element) {
  const styles = {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    zIndex: 10000,
  };

  Object.keys(styles).forEach((property) => {
    element.style[property] = styles[property];
  });

  const folders = element.querySelectorAll('.tgp-folder');
  if (folders) {
    folders.forEach((folder) => {
      folder.style.color = '#FFFFFF'; // Set folder text color to white
    });
  }

  const canvasRect = document.getElementById('canvas').getBoundingClientRect();
  const topOffset = canvasRect.top;
  element.style.top = `${topOffset}px`;
}

    function createGui() {
      if (document.getElementById('gui') !== null){
        document.getElementById('gui').remove();
      }
    
      
      const gui = new GUI();
      gui.domElement.id = 'gui';
      gui.domElement.style.setProperty('position', 'absolute');
      gui.domElement.style.setProperty('top', '20');
      gui.domElement.style.setProperty('z-index', '10000');
      gui.domElement.style.setProperty('width', 'auto');
      gui.domElement.style.setProperty('padding', '20');

  

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
      console.log("modelo", model)
     
      folder1.add(settings, 'Elegir Muestra', data.samples).onChange(function(value) {
      if (model !== undefined) {
        for (let i = 0; i < data.samples.length; i++) {
          if (value === "Todos") {
            const parent = model.parent;
            if (parent !== undefined) {
              parent.visible = true;
            }
          }
          else if (value === data.samples[i]) {
            const child = model.getObjectByName(data.samples[i]); 
            if (child !== undefined) {
              console.log("child", child)
              child.parent.visible = false;
              child.visible = true;
   

            }   
          }
      }
      }
      });
      folder1.add(settings, 'Mostrar Volumen').onChange( showVolumen_relativo );
      folder1.add(settings, 'Mostrar Volumen Total').onChange( showVolumen_total );
      folder1.add(settings, 'Distribuir').onChange( distribuir );
      // folder1.add(settings, 'Cargar todas las muestras').onChange( showAll );


      const folder2 = gui.addFolder( 'Materiales' );
      folder2.add(settings, 'Colores por Default', ["Default", "Daltonismo", "Secuencia", "Divergente"]).onChange( function(value) {
       
        if (value === "Default") {
          setColorLegendData(colorDefault)
          defaultColors(colorDefault);
          
        } else if (value === "Daltonismo") {
          setColorLegendData(colorDaltonic)
          defaultColors(colorDaltonic);

        } else if (value === "Secuencia") {
          setColorLegendData(colorSequential)
          defaultColors(colorSequential);

        } else if (value === "Divergente") {
          setColorLegendData(colorDivergent)
          defaultColors(colorDivergent);

        } else {
          setColorLegendData(colorDefault)
          defaultColors(colorDefault);
          
        }


      });
      setMuiStyles(gui.domElement);
      setMuiStyles(folder1.domElement);
      setMuiStyles(folder2.domElement);
 
      






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
  }, [apiData, createScene]);

  return (
    <>
      <Paper id='canvas' ref={refChangeHandler} elevation={0} sx={{ p: 2, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'row' }} className='withBorder'>
          <Paper id='leyenda' elevation={0} sx={{ p: 2, marginBottom: '10px' } } className='noBorder'>
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