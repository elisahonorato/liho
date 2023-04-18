import React, { useCallback, useState } from 'react';
import axios from 'axios';

function UploadFile({ onUpload }) {
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleSelectedFile = (event) => {
    setFile(event.target.files[0]);
  };

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
        onUpload(res.data);
        setResponse("Archivo subido con Exito");
        setLoading(false);
      })
      .catch((err) => {
        setResponse(err.response.data);
        setLoading(false);
      });
  }, [file, onUpload]);

  return (
    <div>
      <label htmlFor="input-tag">Seleccionar Archivo</label>
      <input type="file" hidden name="" id="input-tag" onChange={handleSelectedFile} />
      <button onClick={handleUpload}>Upload</button>
      <p>{loading ? 'Cargando Modelo..' : response}</p>
    </div>
  );
}

export default UploadFile;
