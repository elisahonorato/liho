import React, { useCallback, useState } from 'react';
import axios from 'axios';
import { Input, InputLabel, Typography } from '@mui/material';
import { MuiButton } from '../theme/MuiButton/MuiButton';
import { MuiBox } from '../theme/MuiBox/MuiBox';
import { LihoClient } from '../../client';


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

    const client = LihoClient(formData)

    axios
      .post(client.props.url, formData)


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
      <MuiButton variant='contained' color='secondary' ><InputLabel htmlFor="input-tag"><Typography variant="body2" color="primary">Seleccionar Archivo</Typography></InputLabel></MuiButton>
      <Input type="file" id="input-tag" inputProps={{ style: { display: 'none' } }} onChange={handleSelectedFile} />
      <MuiButton variant='contained' color='secondary' onClick={handleUpload}><Typography variant="body2" color="primary">Upload</Typography></MuiButton>
      <Typography>{loading ? `Cargando Modelo...` : response}</Typography>
    </MuiBox>
  );
}

export default UploadFile;
