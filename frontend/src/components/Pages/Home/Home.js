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
      const sceneElement = document.getElementById('scene');
    
      const scale = 2; // Adjust the scale factor as needed for higher resolution
    
      // Store the current dimensions of the scene element
      const originalWidth = sceneElement.width;
      const originalHeight = sceneElement.height;
    
      // Set the new dimensions based on the scale factor
      sceneElement.width = originalWidth * scale;
      sceneElement.height = originalHeight * scale;
    
      html2canvas(sceneElement, {
        scale: scale, // Set the scale factor
        width: originalWidth * scale, // Set the desired width
        height: originalHeight * scale // Set the desired height
      }).then(sceneCanvas => {
        // Render the leyenda text on the captured scene canvas

    
        // Convert the captured scene canvas to a data URL
        const combinedScreenshot = sceneCanvas.toDataURL();
    
        // Do something with the combined screenshot
        const link = document.createElement('a');
        link.download = 'combined-screenshot.png';
        link.href = combinedScreenshot;
        link.click();
    
        // Restore the original dimensions of the scene element
        sceneElement.width = originalWidth;
        sceneElement.height = originalHeight;
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

              </Grid>
            </Grid>
          </Container>
        </ThemeProvider>

    );
  }

  export default Home;
