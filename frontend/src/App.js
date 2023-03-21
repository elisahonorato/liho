import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';
import { LihoClient } from './client';
import useApiFetch from './client/useLihoApi';
import axios from 'axios';

function App() {
  const {data, loading, error, sendRequest} = useApiFetch();
  const [file, setFile] = useState()
  const handleselectedFile = (event) => {
    setFile(event.target.files[0])
  }
  console.log(data, loading, error,)
  const handleUpload = () => {
    let formData = new FormData();
    formData.append('file', file, file.name);
    console.log(formData);
    axios.post('http://localhost:8000/probando', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
    },
    })
    // sendRequest('/probando', {
    //   headers: {
    //     // 'content-type': file.type,
    //     'content-length': `${file.size}`, // 👈 Headers need to be a string
    //   },
    //   body: file,
    // });
  }
  return (
    <div className="App">
      <input type="file" name="" id="" onChange={handleselectedFile} />
        <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default () => (
  <LihoClient>
    <App />
  </LihoClient>
)
