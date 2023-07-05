
import React, { useEffect, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {colorDefault, colorDaltonic, colorSequential, colorDivergent } from './colors';
import TwoColumnPaper from './TwoColumnPaper';
import SetGuiStyles from './SetGuiStyle';


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
  const volume_material = new THREE.MeshBasicMaterial({ color: 0x00000, wireframe: true, transparent: true, opacity: 0.1 });

  useEffect(() => {
    createGui();
    loadModel();
    console.log("apiData", apiData);
  }, [apiData]);
  
  const distribuir = (value) => {
    if (value === true) {
      const gridWidth = [-500, -250, 0, 250, 500];

      if (modelRef.current) {
        const parent = modelRef.current;

        parent.children.forEach((child, index) => {
          const i = Math.floor(index / gridWidth.length);
          const j = index % gridWidth.length;
          child.position.set(gridWidth[i], gridWidth[j], 0);
        });

        controlsRef.current.reset();
        cameraRef.current.position.set(0, 0, 1000);
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
            parent.material = volume_material;

            for (let k = 0; k < parent.children.length; k++) {
              if (parent.children[k].name.includes(variable)) {
                parent.children[k].visible = true;

                const color = colorDict[i];
                parent.children[k].material = new THREE.MeshBasicMaterial({
                  color,
                  wireframe: true,
                  transparent: true,
                  opacity: 0.8,
                });
              }
            }
          }
        }
      }


    return updatedData;
});

    
  };

  const createGui = () => {
    if (guiRef.current) {
      guiContainerRef.current?.removeChild(guiRef.current.domElement);
    }
  
    guiRef.current = new GUI({ autoPlace: false });
    guiRef.current.domElement.id = 'gui';
  
    const settings = {
      'Choose Sample': 'All',
      'Colores por Default': 'Default',
      'Distribuir': true,
      'Volumen Relativo': false,
      'Volumen Absoluto': false,

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
  
    const folder1 = guiRef.current.addFolder('Samples');
    const sampleOptions = ['All', ...apiData.samples];
    folder1.add(settings, 'Choose Sample', sampleOptions).onChange(handleChooseSample);

  
    const folder2 = guiRef.current.addFolder('Materiales');
    folder2
      .add(settings, 'Colores por Default', ['Default', 'Daltonismo', 'Secuencia', 'Divergente'])
      .onChange(handleChooseColor);
  
    const folder3 = guiRef.current.addFolder('Posiciones');
    folder3.add(settings, 'Distribuir').onChange(handleDistribuir);

    const folder4 = guiRef.current.addFolder('Volumen');
    folder4.add(settings, 'Volumen Relativo').onChange((value) => {
      handleShowVolume(value, apiData.volumes[0], modelRef.current);
    });
    folder4.add(settings, 'Volumen Absoluto').onChange((value) => {
      handleShowVolume(value, apiData.volumes[1], modelRef.current);
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
          modelRef.current.material = volume_material;
          sceneRef.current.add(modelRef.current);

          modelRef.current.traverse((object) => {
            if (object.type === 'Mesh') {
              object.material = volume_material;
            }
          });

            
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

  useEffect(() => {
    // Initialize the scene and renderer
    sceneRef.current = new THREE.Scene();
    sceneRef.current.background = new THREE.Color(0xffffff);
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, canvas: divRef.current.domElement, precision: 'highp', alpha: true });
    rendererRef.current.setPixelRatio(window.devicePixelRatio);
    rendererRef.current.setSize(window.innerWidth/2, window.innerHeight/2);
    console.log(divRef.current);



 


    if (divRef.current) {
      divRef.current.appendChild(rendererRef.current.domElement);
    }

    // Position the camera
    cameraRef.current.position.z = 5;

    // Add controls
    controlsRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
    controlsRef.current.enableDamping = true;
    controlsRef.current.dampingFactor = 0.05;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      controlsRef.current.update(); // Update controls in the animation loop
    };
    animate();

    // Cleanup function when the component unmounts
    return () => {
      sceneRef.current.remove(modelRef.current);
      rendererRef.current.dispose();
      if (divRef.current && rendererRef.current.domElement) {
        divRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  return (
    <TwoColumnPaper colorLegendData={colorLegendData} divRef={divRef} guiContainerRef={guiContainerRef} />
  );
}


export default ThreeScene;
  