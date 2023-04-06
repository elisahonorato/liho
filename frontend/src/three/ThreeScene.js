import * as THREE from 'three';
import React, { useEffect, useRef} from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import modelo from './modelo.glb';
import { getRandomColorArray } from './Components/RandomColorArray';
import { CSS2DRenderer , CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer.js';


const ThreeScene = ({ data }) => {

  const sceneRef = useRef();

  useEffect(() => {
    // doc
    const container = sceneRef.current

    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000000 );
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.setFocalLength( 18 );

    // renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    container.appendChild( renderer.domElement );

    camera.position.z = 5;

    // lights
    const light = new THREE.PointLight(0xffffff, 1, 50);
    const ambientLight = new THREE.AmbientLight( 0x222222 );
    scene.add( ambientLight );
    light.position.set(0, 0, 0);
    scene.add(light);
    scene.add( new THREE.AxesHelper( 20 ) );

    // controls
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 0, 0 );
    controls.dynamicDampingFactor = 0.3;
    controls.minDistance = 1;
    controls.maxDistance = 100;
    controls.update();

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize( window.innerWidth, window.innerHeight );
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.pointerEvents = 'none';
    labelRenderer.domElement.style.top = '0px';
    container.appendChild( labelRenderer.domElement );

    // model
    const startColor = new THREE.Color(0xff0000);
    const endColor = new THREE.Color(0x0000ff);

    const texture = new THREE.Texture( generateTexture() );
		texture.needsUpdate = true;
    const material = new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } )
    const material2 = new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x009900, shininess: 30, map: texture, transparent: true } )
    const material3 = new THREE.MeshBasicMaterial( { color: 0xffaa00, transparent: true, blending: THREE.AdditiveBlending } )
    const material4 = new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0x666666, emissive: 0xff0000, shininess: 10, opacity: 0.9, transparent: true } )
  // Create a linear gradient material using the start and end colors
    const material5 = new THREE.MeshBasicMaterial({
      color: startColor,
      opacity: 0.4, // Set the opacity to create transparency
      transparent: true,
      blending: THREE.AdditiveBlending // Set the blending mode to additive
    });

    material.color.lerp(endColor, 0.8); // Define the gradient


    var model;


    const loader = new GLTFLoader();
    loader.load(modelo, function (gltf) {
        model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);

        for (let i = 0; i < model.children.length; i++) {

          model.children[i].material = material;
          console.log(data['model']['samples'][i]);



          const p = document.createElement('p');
          p.textContent = model.children[i].name;
          const cPointLabel = new CSS2DObject(p);


        }
        scene.add(model);
      }, undefined, function (error) {
        console.error(error);
      });

      function generateTexture() {

				const canvas = document.createElement( 'canvas' );
				canvas.width = 256;
				canvas.height = 256;

				const context = canvas.getContext( '2d' );
				const image = context.getImageData( 0, 0, 256, 256 );

				let x = 0, y = 0;

				for ( let i = 0, j = 0, l = image.data.length; i < l; i += 4, j ++ ) {

					x = j % 256;
					y = ( x === 0 ) ? y + 1 : y;

					image.data[ i ] = 255;
					image.data[ i + 1 ] = 255;
					image.data[ i + 2 ] = 255;
					image.data[ i + 3 ] = Math.floor( x ^ y );

				}

				context.putImageData( image, 0, 0 );

				return canvas;
			}


    // animate
    function animate() {
      requestAnimationFrame( animate );

      if (model) {
        model.rotation.x += 0.007;
        model.rotation.y += 0.007;
      }
      light.position.copy(camera.position);
      controls.update();
      renderer.render( scene, camera );
      labelRenderer.render( scene, camera );
    }
    animate();

  }, []);
  return <div ref={sceneRef} id='container' />;
};

export default ThreeScene;
