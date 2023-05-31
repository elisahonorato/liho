import React, { useState, useRef } from 'react';
import ThreeScene from './three/ThreeScene';
import UploadFile from './Upload/FileUpload';
import { ThemeProvider } from '@mui/material/styles';
import { Grid, Typography, Paper, Container, Box, Button} from '@mui/material';
import theme from '../../Theme/Theme';




import html2canvas from 'html2canvas';

function Home() {
    const [gltfData, setGltfData] = useState(null);
    const componentRef = useRef(null);

    const handleCapture = () => {
      const guiElement = document.getElementById('gui');

      // Hide the element with ID 'gui'
      guiElement.style.display = 'none';

      html2canvas(document.getElementById("canvas")).then(canvas => {
        const screenshot = canvas.toDataURL();

        // Do something with the screenshot
        const link = document.createElement('a');
        console.log(screenshot);
        link.download = 'screenshot.png';
        link.href = screenshot;
        link.click();

        // Show the element with ID 'gui' again
        guiElement.style.display = 'block';
      });
    };


    const handleUpload = (data) => {
      setGltfData(data);
    };


    return (
        <ThemeProvider theme={theme}>
          <Container class maxWidth="xl">
            <Grid container spacing={1}>
              {/* Header */}
              <Grid item xs={12}>
              </Grid>
              <Grid item xs={12}>
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
                    <Button variant='contained' color='secondary' onClick={handleCapture}>Descargar</Button>
                  </Paper>
                )}

              </Grid>

              {/* Right column */}
              <Grid item xs={12} md={10}>
                {gltfData != null && (
                  <Box sx={{ flexGrow: 1 }}><ThreeScene ref={componentRef} apiData={gltfData} /></Box>

                )}
                  <Paper elevation={3} sx={{ p: 2, position: 'relative', overflow: 'hidden', display: 'flex' }} id='canvas'>
                      <Paper elevation={0} sx={{ display: 'content' , padding: '20'}} id='leyendaColores'></Paper>
                      <Typography id= "texto" variant="h6" gutterBottom></Typography>

                  </Paper>

              </Grid>
            </Grid>
          </Container>
        </ThemeProvider>

    );
  }

  export default Home;
