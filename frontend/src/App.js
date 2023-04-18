import React, { useState } from 'react';
import { LihoClient, useApiFetch } from './client';
import ThreeScene from './three/ThreeScene';
import HeaderItems from './HeaderItems';
import Header from './components/Header';
import UploadFile from './components/Upload/FileUpload';

function App() {
  const [gltfData, setGltfData] = useState(null);

  const handleUpload = (data) => {
    setGltfData(data);
  };

  return (
    <div className="App">
      <Header menuItems={HeaderItems} />
      <UploadFile onUpload={handleUpload} />
      {gltfData != null && <ThreeScene data={gltfData} />}
    </div>
  );
}

export default App;
