import logo from './logo.svg';
import './App.css';
import React, { useCallback, useState } from 'react';
import { LihoClient, useApiFetch } from './client';
import axios from 'axios';
import Papa from 'papaparse';
import ThreeScene from './three/ThreeScene';
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";



function App() {
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const [count, setCount] = useState(0);
  const [papaParseData, setPapaParseData] = useState();

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
        setResponse("File Uploaded");
        setLoading(false);
        setFile(undefined);

        // Hacer algo con gltfData
      })
      .catch((error) => {
        console.log(error.response.data)
        setResponse(JSON.stringify(error.response.data));
      });

  }, [file]);
  function handleClick() {
    setCount(count + 1);
  }


  return (
    <div className="App">
      <input type="file" name="" id="" onChange={handleSelectedFile} />
      <button onClick={handleUpload}>Upload</button>
      <MyButton />
      <p>{loading ? 'Cargando Modelo..' : response}</p>
    </div>
  );
}

export default () => (
  <LihoClient>
    <App />
  </LihoClient>
);
function MyButton() {
  const [count, setCount] = useState(0);
  function handleClick() {
    setCount(count + 1);
  }
  return (
    <button onClick={handleClick}>Clicked {count}</button>
  );
};
