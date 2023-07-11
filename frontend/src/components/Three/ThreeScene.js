
import React, { useEffect, useRef } from 'react';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import {colorDefault, colorDaltonic, colorSequential, colorDivergent } from './colors';
import TwoColumnPaper from './TwoColumnPaper';
import SetGuiStyles from './SetGuiStyle';
import createTextObject from './createTextObject';


function ThreeScene({ apiData }) {
  const guiContainerRef = useRef(null);
  const guiRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const modelRef = useRef(null);
  const cameraRef = useRef(null);
  const divRef = useRef(null);
  const controlsRef = useRef(null);
  const [colorLegendData, setColorLegendData] = React.useState([]);
  const volumeMaterialRef = useRef(null);
  const sampleMaterialRef = useRef(null);
  const volumeAbsRef = useRef(null);
  const mostrarDatos = useRef(false);
  const fontSize = useRef(12);
  const samplePosition = useRef({x: 0, y: 0, z: 0});
  const sampleDistance = useRef(2000);
  const modelPosition = useRef({x: 0, y: 0, z: 0});


  useEffect(() => {
    // Initialize the scene and renderer
    sceneRef.current = new THREE.Scene();
    sceneRef.current.background = new THREE.Color(0xffffff);
    sceneRef.current.add(new THREE.AmbientLight(0x505050));
    sceneRef.current.add(new THREE.HemisphereLight(0x606060, 0x404040));

    const devicePixelRatio = window.devicePixelRatio || 1;


    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100000
    );


   
    
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, canvas: divRef.current.domElement, precision: 'highp', alpha: true });
    rendererRef.current.setPixelRatio(devicePixelRatio);
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current.setClearColor(0xffffff, 0);
    rendererRef.current.shadowMap.enabled = true;
    rendererRef.current.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current.useLegacyLights = false;


    if (divRef.current) {
      divRef.current.appendChild(rendererRef.current.domElement);
    }

    // Position the camera
    cameraRef.current.position.z = 5;

    // Add controls
    controlsRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
    controlsRef.current.enableDamping = true;
    controlsRef.current.dampingFactor = 0.05;
    controlsRef.current.screenSpacePanning = false; 
    

  

    volumeMaterialRef.current = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });

    sampleMaterialRef.current = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });

    // Cleanup function when the component unmounts
    return () => {
      sceneRef.current.remove(modelRef.current);
      rendererRef.current.dispose();
      if (divRef.current && rendererRef.current.domElement) {
        divRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  useEffect(() => {
    createGui();
    loadModel();
    console.log("apiData", apiData);

    const animate = () => {
      requestAnimationFrame(animate);
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      controlsRef.current.update();

  

      if (volumeAbsRef.current !== undefined && volumeAbsRef.current !== null ) {
        volumeAbsRef.current.rotation.y += 0.002;
      }
    };
    
    animate();
  }, [apiData]);
  
  const distribuir = (value) => {
    if (value === true) {
      const numChildren = modelRef.current.children.length - 1;
      const sqrtNumChildren = Math.ceil(Math.sqrt(numChildren));
  
      const gridWidth = [];
      const separation = sampleDistance.current / sqrtNumChildren;
      const halfSeparation = separation / 2;
  
      const offsetX = -500 + (1000 - separation * sqrtNumChildren) / 2;
      const offsetY = -500 + (1000 - separation * sqrtNumChildren) / 2;
  
      for (let i = 0; i < sqrtNumChildren; i++) {
        for (let j = 0; j < sqrtNumChildren; j++) {
          const x = offsetX + halfSeparation + i * separation;
          const y = offsetY + halfSeparation + j * separation;
          gridWidth.push(x, y, 0);
        }
      }
  
      if (modelRef.current) {
        const parent = modelRef.current;
  
        parent.children.forEach((child, index) => {
          if (child.name !== apiData.volumes[1]) {
            child.position.set(gridWidth[index * 3], gridWidth[index * 3 + 1], gridWidth[index * 3 + 2]);
          }
        });
  
        controlsRef.current.reset();
        cameraRef.current.position.set(0, 0, 1000);
        cameraRef.current.lookAt(0, 0, 0);
      }
    } else {
      if (modelRef.current) {
        const parent = modelRef.current;
  
        parent.children.forEach((child) => {
          child.position.set(0, 0, 0);
        });
      }
    }
  };
  
  const paintModel = (colorDict) => {
    setColorLegendData((prevData) => {
      const updatedData = [prevData];
      const variables = apiData.variables;

      for (let i = 0; i < variables.length; i++) {
        const variable = variables[i];

        if (!updatedData.some((item) => item.id === variable)) {
          updatedData.push({
            id: variable,
            color: colorDict[i],
            text: variable,
          });
        }

        for (let j = 0; j < apiData.samples.length; j++) {
          const sampleName = apiData.samples[j];
          const parent = modelRef.current.getObjectByName(sampleName);

          if (parent) {
            parent.material = volumeMaterialRef.current;
            for (let k = 0; k < parent.children.length; k++) {
              if (parent.children[k].name.includes(variable)) {
                parent.children[k].visible = true;
                const color = colorDict[i];
                parent.children[k].material = sampleMaterialRef.current.clone();
                parent.children[k].material.color = new THREE.Color(color);

            }
          }
        }
      }
    }


    return updatedData;
});

    
  };
  const moverModelo = () => {
    if (modelRef.current) {
      const parent = modelRef.current;
      parent.position.set(modelPosition.current.x, modelPosition.current.y, modelPosition.current.z);
    }
  };



  const createGui = () => {
    if (guiRef.current) {
      guiContainerRef.current?.removeChild(guiRef.current.domElement);
    }
  
    guiRef.current = new GUI({ autoPlace: false });
    guiRef.current.domElement.id = 'gui';
    mostrarDatos.current = false;
  
    const settings = {
      'Choose Sample': 'All',
      'Colores por Default': 'Default',
      'Distribuir': true,
      'Distancia': sampleDistance.current,
      'Volumen Relativo': false,
      'Volumen Absoluto': false,
      'Mostrar Datos': mostrarDatos.current,
      'fontSize': fontSize.current,
      'Y': samplePosition.current.y,
      'X': samplePosition.current.x,
      'Z': samplePosition.current.z,
      'Mover Modelo': modelPosition.current.x,
    };
  
    const handleChooseSample = (value) => {
      if (modelRef.current) {
        const parent = modelRef.current;
  
        if (value === 'All') {
          parent.visible = true;
          parent.children.forEach((child) => {
            child.visible = true;
          });
        } else {
          parent.children.forEach((child) => {
            if (child.name === value) {
              child.visible = true;
              child.parent.visible = true;
            } else {
              child.visible = false;
              child.parent.visible = false;
            }
          });
        }
      }
    };

    const handleChooseColor = (value) => {
      const colorOptions = {
        Default: colorDefault,
        Daltonismo: colorDaltonic,
        Secuencia: colorSequential,
        Divergente: colorDivergent,
      };
  
      setColorLegendData(colorOptions[value] || colorDefault);
      paintModel(colorOptions[value] || colorDefault);
    };

    const handleShowVolume = (visibility, volume, model) => {
      if (model.name.includes(volume)) {
        model.visible = visibility;
        console.log("model", model, model.name);
      }
      else {
        model.children.forEach((child) => {
          handleShowVolume(visibility, volume, child);
        });
      }
    };
  
    const handleDistribuir = (value) => {
      distribuir(value);
    };
    const handleMoverModelo = (value) => {
      modelPosition.current.x = value;

      cameraRef.current.lookAt(modelPosition.current.x, 0, 0);


    
      
      moverModelo();
    };
    const handleMostrarDatos = (value) => {
      if (modelRef.current) {
        const parent = modelRef.current;
        parent.children.forEach((child) => {
          if (child !== volumeAbsRef.current) {
            if (value === true) {
              mostrarDatos.current = true;
              if (child.getObjectByName("Text") !== undefined && child.getObjectByName("Text") !== null ) {
                
                child.remove(child.getObjectByName("Text"));
                const sampleText = createTextObject(child.name, fontSize.current, 0x000000, samplePosition.current);
                sampleText.name = "Text";
                child.add(sampleText);
                
                sampleText.visible = true;
              
              }
              else
              {
                const sampleText = createTextObject(child.name, fontSize.current, 0x000000, samplePosition.current);
                sampleText.position.y = apiData.volumes[2] + 10;
                sampleText.name = "Text";
                sampleText.visible = true;
                child.add(sampleText);
              }
            }
            else if (value === false) {
              mostrarDatos.current = false;
              if (child.getObjectByName("Text") !== undefined && child.getObjectByName("Text") !== null ) {
                child.getObjectByName("Text").visible = false;
              }
            }
          }
      });
      }
    };
      
    const folder1 = guiRef.current.addFolder('Samples');
    const sampleOptions = ['All', ...apiData.samples];
    folder1.add(settings, 'Choose Sample', sampleOptions).onChange(handleChooseSample);

  
    const folder2 = guiRef.current.addFolder('Materiales');
    folder2
      .add(settings, 'Colores por Default', ['Default', 'Daltonismo', 'Secuencia', 'Divergente'])
      .onChange(handleChooseColor);
  
    const folder3 = guiRef.current.addFolder('Posiciones');
    folder3.add(settings, 'Distribuir').onChange(handleDistribuir);

    folder3.add(settings, 'Distancia', 0, 100000).onChange((value) => {
      sampleDistance.current = value;
      handleDistribuir(true);
    });

    folder3.add(settings, 'Mover Modelo', -10000, 10000).onChange((value) => {
      handleMoverModelo(value);
    });

    const folder4 = guiRef.current.addFolder('Volumen');
    folder4.add(settings, 'Volumen Relativo').onChange((value) => {
      handleShowVolume(value, apiData.volumes[0], modelRef.current);
    });
    folder4.add(settings, 'Volumen Absoluto').onChange((value) => {
      handleShowVolume(value, apiData.volumes[1], modelRef.current);
    });

    const folder5 = guiRef.current.addFolder('Datos');
    folder5.add(settings, 'Mostrar Datos').onChange((value) => {
      handleMostrarDatos(value);
    });
    folder5.add(settings, 'fontSize', 6, 100).onChange((value) => {
      fontSize.current = value;
      handleMostrarDatos(mostrarDatos.current);
    });
    folder5.add(settings, 'X', -200, 200).onChange((value) => {
      samplePosition.current.x = value;
      handleMostrarDatos(mostrarDatos.current);
    });
    folder5.add(settings, 'Y', -200, 200).onChange((value) => {
      samplePosition.current.y = value;
      handleMostrarDatos(mostrarDatos.current);
    });
    folder5.add(settings, 'Z', -200, 200).onChange((value) => {
      samplePosition.current.z = value;
      handleMostrarDatos(mostrarDatos.current);
    });



    
  
    guiContainerRef.current?.appendChild(guiRef.current.domElement);
    SetGuiStyles(guiRef.current.domElement);
  };
  
  const loadModel = () => {
    try {
      // Extract the GLTF file content from the response data
      const gltfContent = apiData.content;

      // Convert the base64-encoded GLTF content back to binary
      const gltfData = atob(gltfContent);
      const arrayBuffer = new ArrayBuffer(gltfData.length);
      const uintArray = new Uint8Array(arrayBuffer);

      // Copy the binary data into the Uint8Array
      for (let i = 0; i < gltfData.length; i++) {
        uintArray[i] = gltfData.charCodeAt(i);
      }

      const loader = new GLTFLoader();
      loader.parse(
        arrayBuffer,
        '', // Path for additional resources
        (gltf) => {
          if (modelRef.current) {
            sceneRef.current.remove(modelRef.current);
          }

          modelRef.current = gltf.scene;
          modelRef.current.material = volumeMaterialRef.current;
          sceneRef.current.add(modelRef.current);

          modelRef.current.traverse((object) => {
            if (object.type === 'Mesh') {
              object.material = volumeMaterialRef.current;
            }
          });
          for (let i = 0; i < apiData.volumes.length; i++) {
            if (modelRef.current.getObjectByName(apiData.volumes[1]) !== undefined) {
              volumeAbsRef.current = modelRef.current.getObjectByName(apiData.volumes[1]);
              volumeAbsRef.current.material = volumeMaterialRef.current;
            }
          }
         
          distribuir(true);
          setColorLegendData([])
          paintModel(colorDefault);
        },
        (xhr) => {
          console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
        },
        (error) => {
          console.error('Error loading model:', error);
        }
      );
    } catch (error) {
      // Handle any errors that occur during the fetch or parsing
      console.error('Error loading file:', error);
    }
  };



  return (
    <TwoColumnPaper colorLegendData={colorLegendData} divRef={divRef} guiContainerRef={guiContainerRef} />
  );
}


export default ThreeScene;
  