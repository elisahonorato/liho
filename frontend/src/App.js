import React, { useState, useRef } from 'react';
import LihoClient from './client/LihoClient';
import ThreeScene from './three/ThreeScene';
import HeaderItems from './HeaderItems';
import Header from './components/Header';
import UploadFile from './components/Upload/FileUpload';
import { ThemeProvider } from '@mui/material/styles';
import { Grid, Typography, Paper, Container, Box, Button} from '@mui/material';
import theme from './components/theme/theme'
import html2canvas from 'html2canvas';

function App() {
  const [gltfData, setGltfData] = useState(null);
  const componentRef = useRef(null);

  const handleCapture = () => {
    html2canvas(document.getElementById("paper_container")).then(canvas => {
      const screenshot = canvas.toDataURL();

      // Do something with the screenshot
      const link = document.createElement('a');
      console.log(screenshot);
      link.download = 'screenshot.png';
      link.href = screenshot;
      link.click();

    });
  };

  const handleUpload = (data) => {
    setGltfData(data);
  };




  return (
    <LihoClient>
      <ThemeProvider theme={theme}>
        <Container maxWidth="xl">
          <Grid container spacing={1}>
            {/* Header */}
            <Grid item xs={12}>
              <Header menuItems={HeaderItems} />
            </Grid>

            {/* Left column */}
            <Grid item xs={12} md={2}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  1. Sube tu archivo CSV
                </Typography>
                <UploadFile onUpload={handleUpload}/>
              </Paper>
              {gltfData != null && (
                <Paper elevation={3} sx={{ p: 2, mt: 2}}>
                  <Typography variant="h6" gutterBottom>
                    2. Descarga tu gráfico
                  </Typography>
                  <Button variant="contained" color="primary" onClick={handleCapture}>Descargar</Button>

                </Paper>
              )}

            </Grid>

            {/* Right column */}
            <Grid item xs={10} md={10} id="canvas_container">
              {gltfData != null && (
                <Paper elevation={3} sx={{ p: 2 }} id="paper_container">
                  <Box id='canvas' sx={{display: "flex"}}>
                    <Paper elevation={0} sx={{ display: 'content' , padding: '20'}} id='leyendaColores'>
                    </Paper>
                    <Typography id= "texto" variant="h6" gutterBottom></Typography>
                    <ThreeScene ref={componentRef} data={gltfData} />
                    <Box id='leyenda' sx={{display: "flex"}}>
                    </Box>
                    </Box>
                </Paper>
              )}
              {ThreeScene.all === true && (
                  <UploadFile onUpload={handleUpload}/>
              )}


            </Grid>

            {/* Footer */}
            <Grid item xs={12}>
              <Typography variant="body1" align="center">
                © 2023 Liho. Todos los derechos reservados.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </LihoClient>

  );
};

export default App;
