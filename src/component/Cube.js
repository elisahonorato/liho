import { useEffect, useMemo, useRef, useLoader, useCallback, useFrame } from 'react';
import circleImg from './assets/circle.png'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module'




function Cube() {
    useEffect(() => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
      camera.position.z = 96;
      const canvas = document.getElementById('Threejs')
      const renderer = new THREE.WebGLRenderer({canvas, antialias:true,})
      renderer.setSize(window.innerWidth, window.innerHeight)
      document.body.appendChild(renderer.domElement)
  
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      ambientLight.castShadow = true;
      scene.add( ambientLight );
  
      const spotLight = new THREE.SpotLight(0xffffff, 0.5);
      spotLight.position.set(0, 64, 32);
      spotLight.castShadow = true;
      scene.add( spotLight );
  
      const boxGeometry = new THREE.BoxGeometry(16,16,16)
      const boxMaterial = new THREE.MeshNormalMaterial();
      const boxMesh = new THREE.Mesh(boxGeometry,boxMaterial);
      scene.add(boxMesh);
  
      // add orbit controls
      const controls = new OrbitControls(camera, renderer.domElement);
  
      // add stats
      const stats = Stats();
      document.body.appendChild(stats.dom);
      
  
      const animate = () => {
        boxMesh.rotation.x += 0.01;
        boxMesh.rotation.y += 0.03;
        stats.update()
        controls.update()
        renderer.render(scene, camera);
        window.requestAnimationFrame(animate);
      };
      animate();
    }, []);
  }
  export default Cube;