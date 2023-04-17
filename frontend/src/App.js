import logo from './logo.svg';
import './App.css';
import React, { useCallback, useState } from 'react';
import { LihoClient, useApiFetch } from './client';
import axios from 'axios';
import ThreeScene from './three/ThreeScene';



function App() {
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [gltfData, setGltfData] = useState(null);


  const [count, setCount] = useState(0);


  // Handle File Upload
  const handleSelectedFile = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle Request from File
  const handleUpload = useCallback(() => {
    let formData = new FormData();
    formData.append('file', file, file.name);
    setLoading(true);
    axios
      .post('http://localhost:8000/probando/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        setGltfData(res.data);
        setResponse("Archivo subido con Exito");
        setLoading(false);

      })
      .catch((err) => {
        setResponse(err.response.data);
        setLoading(false);


      }
      );


  }, [file]);
  function handleClick() {
    setCount(count + 1);
  }


  return (
    <div className="App">
      <label htmlFor="input-tag">Seleccionar Archivo</label>
      <input type="file" hidden name="" id="input-tag" onChange={handleSelectedFile} />
      <button onClick={handleUpload}>Upload</button>
      <p>{loading ? 'Cargando Modelo..' : response}</p>
      {gltfData != null && <ThreeScene data={gltfData} />}

    </div>
  );
}

export default () => (
  <LihoClient>
    <App />
  </LihoClient>
);

