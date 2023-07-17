import React, { useState, useRef } from 'react';
import ThreeScene from '../../Three/ThreeScene';
import UploadFile from '../../Upload/FileUpload';
import { ThemeProvider } from '@mui/material/styles';
import { Grid, Typography, Paper, Container, Box, Button} from '@mui/material';
import theme from '../../Theme/Theme';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';




import html2canvas from 'html2canvas';

function Use() {
    const [gltfData, setGltfData] = useState(null);
    const componentRef = useRef(null);
    const modelRef = useRef(null);

    const handleCapture = () => {
      const guiElement = document.getElementById('gui');

  
      // Hide the element with ID 'gui'
      guiElement.style.display = 'none';

  
      html2canvas(document.getElementById("canvas")).then(canvas => {
        const screenshot = canvas.toDataURL();
   
  
        // Download the screenshot
        const screenshotLink = document.createElement('a');
        screenshotLink.download = 'screenshot.png';
        screenshotLink.href = screenshot;
        screenshotLink.click();
  
        // Export the GLTF file
        const exporter = new GLTFExporter();
        exporter.parse(modelRef.current, (gltf) => {
          const gltfData = JSON.stringify(gltf);

          const gltfBlob = new Blob([gltfData], { type: 'application/octet-stream' });
          const gltfUrl = URL.createObjectURL(gltfBlob);

          const gltfLink = document.createElement('a');
          gltfLink.download = 'modelo.gltf';
          gltfLink.href = gltfUrl;
          gltfLink.click();

          URL.revokeObjectURL(gltfUrl);

          // Show the element with ID 'gui' again
          guiElement.style.display = 'block';
        });
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
                <Paper elevation={0} sx={{ p: 2, m: 1}} className="withBorder">
                  <Typography variant="h6" gutterBottom>
                    1. Sube tu archivo CSV
                  </Typography>
                  <UploadFile onUpload={handleUpload}/>
                </Paper>
                {gltfData != null && (
                  <Paper elevation={0} sx={{ p: 2, mt: 2}} className='withBorder'>
                    <Typography variant="h6" gutterBottom>
                      2. Descarga tu gráfico y modelo 3D
                    </Typography>
                    <Button onClick={handleCapture}>
                      <Typography variant="body2" color="primary">
                        Descargar
                      </Typography>
                    </Button>
                  </Paper>
                )}

              </Grid>

              {/* Right column */}
              <Grid item xs={12} md={10}>
                {gltfData != null && (
                  <Box sx={{ flexGrow: 1 }}><ThreeScene divRef={componentRef} apiData={gltfData} model={modelRef} /></Box>

                )}

              </Grid>
            </Grid>
          </Container>
        </ThemeProvider>

    );
  }

  export default Use;
