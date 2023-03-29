import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function GLTFLoaderExample( gltf ) {
  const [gltf, setGltf] = useState(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load((gltf) => {
      setGltf(gltf);
    });
  }, []);

  if (!gltf) {
    return <div>Loading...</div>;
  }

  return (
    <mesh>
      <primitive object={gltf.scene} />
    </mesh>
  );
}
