import React, { useState, useRef } from 'react';
import ThreeScene from '../../Three/ThreeScene';
import UploadFile from '../../Upload/FileUpload';
import { ThemeProvider } from '@mui/material/styles';
import { Grid, Typography, Paper, Container, Box, Button} from '@mui/material';
import theme from '../../Theme/Theme';




import html2canvas from 'html2canvas';

function Use() {
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
                <Paper elevation={0} sx={{ p: 2, m: 1}} className="withBorder">
                  <Typography variant="h6" gutterBottom>
                    1. Sube tu archivo CSV
                  </Typography>
                  <UploadFile onUpload={handleUpload}/>
                </Paper>
                {gltfData != null && (
                  console.log(gltfData),
                  <Paper elevation={0} sx={{ p: 2, mt: 2}} className='withBorder'>
                    <Typography variant="h6" gutterBottom>
                      2. Descarga tu gráfico
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
                  <Box sx={{ flexGrow: 1 }}><ThreeScene ref={componentRef} apiData={gltfData} /></Box>

                )}

              </Grid>
            </Grid>
          </Container>
        </ThemeProvider>

    );
  }

  export default Use;
