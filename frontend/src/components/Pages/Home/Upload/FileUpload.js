import React, { useCallback, useState } from 'react';
import axios from 'axios';
import { Button, Input, InputLabel, Typography } from '@mui/material';
import { MuiBox } from '../../../theme/MuiBox/MuiBox';
import { LihoClient } from '../../../../client';
import theme from '../../../theme/theme';

function UploadFile({ onUpload }) {
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleSelectedFile = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = useCallback(() => {
    let formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    const client = LihoClient(formData);

    axios
      .post(client.props.url, formData, client.props.config)

      .then((res) => {
        console.log(res)
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
    <MuiBox>
      <Button
        variant="contained"
        color="secondary"
        component="label"
      >
        <InputLabel htmlFor="input-tag">
          <Typography variant="body2" color={'primary'}>Seleccionar Archivo</Typography>
        </InputLabel>
        <Input
          type="file"
          id="input-tag"
          inputProps={{ style: { display: 'none' } }}
          onChange={handleSelectedFile}
        />
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleUpload}
      >
        <Typography variant="body2" color="primary">
          Upload
        </Typography>
      </Button>
      <Typography>{loading ? `Cargando Modelo...` : response}</Typography>
    </MuiBox>
  );
}

export default UploadFile;
