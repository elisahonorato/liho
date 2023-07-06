import * as THREE from 'three';
import React, { useEffect, useRef, useState } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Paper } from '@mui/material';
import CreateGui from './CreateGui';

const ThreeScene = ({ apiData }) => {
  const [divRef, setDivRef] = useState(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const modelRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      if (!sceneRef.current || rendererRef.current || !apiData) return;
      console.log("New data from the backend");

      try {
        // Clear the scene by removing all children
        if (sceneRef.current.children.length > 0) {
          sceneRef.current.remove(...sceneRef.current.children);
        }
        
        console.log("Scene cleared");

        // Load the GLTF file
        const gltfContent = apiData.content;
        const gltfData = atob(gltfContent);
        const arrayBuffer = new ArrayBuffer(gltfData.length);
        const uintArray = new Uint8Array(arrayBuffer);

        for (let i = 0; i < gltfData.length; i++) {
          uintArray[i] = gltfData.charCodeAt(i);
        }

        const loader = new GLTFLoader();
        const gltf = await new Promise((resolve, reject) => {
          loader.parse(
            arrayBuffer,
            '',
            resolve,
            reject
          );
        });
        modelRef.current = gltf.scene;

        setIsModelLoaded(true);
        console.log("Model loaded:", modelRef.current);
      } catch (error) {
        console.error('Error loading file:', error);
      }
    };
    loadModel();

    // Clean up the scene and remove the GUI
    return () => {
      if (sceneRef.current) {
        sceneRef.current.remove(...sceneRef.current.children);
      }
      setIsModelLoaded(false);
    };
  }, [apiData]);

  useEffect(() => {
    if (!sceneRef.current || !apiData || !divRef) return;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const camera = new THREE.PerspectiveCamera(
      75,
      divRef.clientWidth / divRef.clientHeight,
      0.1,
      1000
    );

    renderer.setSize(divRef.clientWidth, divRef.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    camera.position.z = apiData.vol_relativo * 2 / 3;

    const light = new THREE.PointLight(0xfffff0, 1000, 2000);
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);
    light.position.set(0, 0, 0);
    scene.add(light);
    scene.add(new THREE.AxesHelper(20));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.dynamicDampingFactor = 0.3;
    controls.minDistance = 0;
    controls.maxDistance = 1500;
    controlsRef.current = controls;
    controls.update();

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    divRef.appendChild(rendererRef.current.domElement);
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  }, [apiData, divRef]);

  const refChangeHandler = (ref) => {
    setDivRef(ref);
  };

  return (
    <>
      <Paper
        id="canvas"
        ref={refChangeHandler}
        elevation={0}
        sx={{
          p: 2,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'row'
        }}
        className="withBorder"
      >
        {isModelLoaded && <CreateGui apiData={apiData} modelRef={modelRef.current} />}
      </Paper>
      {/* Rest of the JSX */}
    </>
  );
};

export default ThreeScene;
