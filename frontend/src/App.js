import React, { useState } from 'react';
import { LihoClient, useApiFetch } from './client';
import ThreeScene from './three/ThreeScene';
import HeaderItems from './HeaderItems';
import Header from './components/Header';
import UploadFile from './components/Upload/FileUpload';
import { ThemeProvider } from '@mui/material/styles';
import { Grid, Typography, Paper, Container, Box } from '@mui/material';
import theme from './components/theme/theme'

function App() {
  const [gltfData, setGltfData] = useState(null);



  const handleUpload = (data) => {
    setGltfData(data);
  };

  return (
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
              <UploadFile onUpload={handleUpload} />
            </Paper>
          </Grid>

          {/* Right column */}
          <Grid item xs={10} md={10}>
            {gltfData != null && (
              <Paper elevation={3} sx={{ p: 2 }}>
                <Box id='canvas'><ThreeScene data={gltfData} /></Box>
              </Paper>
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

  );
};

export default App;
