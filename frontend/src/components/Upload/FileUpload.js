import React, { useCallback, useState } from 'react';
import axios from 'axios';
import { Button, Input, InputLabel, Typography } from '@mui/material';
import { LihoClient } from '../../client';
import { MuiBox } from '../Theme/MuiBox/MuiBox';


function UploadFile({ onUpload }) {
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [userFilename, setUserFilename] = useState(null);


  const handleSelectedFile = (event) => {
    setFile(event.target.files[0]);
  };

  const sendRequest = useCallback(async (nSamples, nColumns, reqFile) => {
    const formData = new FormData();
    formData.append('file', reqFile);
    formData.append('n_samples', nSamples);
    formData.append('n_columns', nColumns);
    formData.append('userFilename', userFilename);

    const client = LihoClient(formData);
    const res = await axios.post(client.props.url, formData, client.props.config);
    setUserFilename(res.data.userFilename);
    onUpload(res.data);
    console.log(res.data);

  }, [onUpload, userFilename]);

  const handleUpload = useCallback(async () => {
    setLoading(true);
    try {
      await sendRequest(15, 15, file);
      setLoading(false);
      // Send the second request immediately after the first one
      sendRequest("all", "all", file);
      setResponse("Archivo subido con éxito");
    } catch (err) {
      setTimeout(() => {
        setResponse("Error: El servidor no está respondiendo");
        setLoading(false);
      }, 20000); // Delay of 20 seconds
      if (err.response) {
        setResponse(err.response.data);
      } else {
        setResponse("Error: " + err.message);
      }
      setLoading(false);
      // Retry the first request if an error occurs
    }
  }, [file]);
  
  return (
    <MuiBox>
      <Button>
        <InputLabel htmlFor="input-tag">
          <Typography variant="body2" color="primary">
            Seleccionar Archivo
          </Typography>
        </InputLabel>
        <Input
          type="file"
          id="input-tag"
          inputProps={{ style: { display: 'none' } }}
          onChange={handleSelectedFile}
        />
      </Button>
      <Button onClick={handleUpload}>
        <Typography variant="body2" color="primary">
          Upload
        </Typography>
      </Button>
      <Typography>{loading ? `Cargando Modelo...` : response}</Typography>
    </MuiBox>
  );
}

export default UploadFile;
