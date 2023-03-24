import logo from './logo.svg';
import './App.css';
import React, { useCallback, useState } from 'react';
import { LihoClient, useApiFetch } from './client';
import axios from 'axios';
import Papa from 'papaparse';
import * as THREE from 'three';
import ThreeScene from './three/ThreeScene';



function App() {
  const [file, setFile] = useState();
  const [response, setResponse] = useState('');
  const [papaParseData, setPapaParseData] = useState();

  const handleSelectedFile = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = useCallback(() => {
    let formData = new FormData();
    formData.append('file', file, file.name);
    console.log(formData);
    axios
      .post('http://localhost:8000/probando', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log(response.data); // log the response data to the console
        setResponse(JSON.stringify(response.data)); // update the state with the response data

        // Parse the CSV file and create a mesh for each row
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            setPapaParseData(results.data);
          },
        });

      })
      .catch((error) => {
        console.log(error.response.data)
        setResponse(JSON.stringify(error.response.data));
      });

  }, [file]);
  return (
    <div className="App">
      <input type="file" name="" id="" onChange={handleSelectedFile} />
      <button onClick={handleUpload}>Upload</button>
      <div>{response}</div> {/* render the response data on the screen */}
      {papaParseData && <ThreeScene data={papaParseData } />}

    </div>
  );
}

export default () => (
  <LihoClient>
    <App />
  </LihoClient>
);
