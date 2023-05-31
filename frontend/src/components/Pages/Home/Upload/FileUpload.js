import React, { useCallback, useState } from 'react';
import axios from 'axios';
import { Button, Input, InputLabel, Typography } from '@mui/material';
import { MuiBox } from '../../../theme/MuiBox/MuiBox';
import { LihoClient } from '../../../../client';


function UploadFile({ onUpload }) {
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [userFilename, setUserFilename] = useState('null');

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

  }, [onUpload, userFilename]);

  const handleUpload = useCallback(async () => {
    setLoading(true);
    try {
      await sendRequest(15, 15, file);
      setResponse("Archivo subido con éxito");
      sendRequest(null, null, file);
    } catch (err) {
      setResponse(err.response.data);
    }
    setLoading(false);
  }, [file, sendRequest]);

  return (
    <MuiBox>
      <Button variant="contained" color="secondary" component="label">
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
      <Button variant="contained" color="secondary" onClick={handleUpload}>
        <Typography variant="body2" color="primary">
          Upload
        </Typography>
      </Button>
      <Typography>{loading ? `Cargando Modelo...` : response}</Typography>
    </MuiBox>
  );
}

export default UploadFile;

