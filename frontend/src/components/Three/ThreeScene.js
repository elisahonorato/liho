
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
  const volume_material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.8 });

  useEffect(() => {
    createGui();
    loadModel();
  }, [apiData]);

  const paintModel = (colorDict) => {
    setColorLegendData((prevData) => {
      const updatedData = [prevData];

      for (let i = 0; i < apiData.variables.length; i++) {
        const variable = apiData.variables[i];

        if (!updatedData.some((item) => item.id === variable)) {
          updatedData.push({
            id: variable,
            color: colorDict[i],
            text: variable,
          });
        }

        for (let j = 0; j < apiData.samples.length; j++) {
          const parent = modelRef.current.getObjectByName(apiData.samples[j]);

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
    };
  
    const handleChooseSample = (value) => {
      if (modelRef.current) {
        const parent = modelRef.current;
        parent.visible = value === 'All';
        const child = modelRef.current.getObjectByName(value);
        child.parent.visible = !parent.visible;
        child.visible = true;
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
  
    const folder1 = guiRef.current.addFolder('Samples');
    const sampleOptions = ['All', ...apiData.samples];
    folder1.add(settings, 'Choose Sample', sampleOptions).onChange(handleChooseSample);
  
    const folder2 = guiRef.current.addFolder('Materiales');
    folder2
      .add(settings, 'Colores por Default', ['Default', 'Daltonismo', 'Secuencia', 'Divergente'])
      .onChange(handleChooseColor);
  
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
          modelRef.current = gltf.scene;
          sceneRef.current.add(modelRef.current);
         
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
  