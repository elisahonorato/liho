import React, { useState } from 'react';
import { LihoClient, useApiFetch } from './client';
import ThreeScene from './three/ThreeScene';
import HeaderItems from './HeaderItems';
import Header from './components/Header';
import UploadFile from './components/Upload/FileUpload';
import { ThemeProvider } from '@mui/material/styles';
import theme from './components/theme/theme'

function App() {
  const [gltfData, setGltfData] = useState(null);



  const handleUpload = (data) => {
    setGltfData(data);
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Header menuItems={HeaderItems} />
        <UploadFile onUpload={handleUpload} />
        {gltfData != null && <ThreeScene data={gltfData} />}
      </div>
    </ThemeProvider>
  );
}

export default App;
