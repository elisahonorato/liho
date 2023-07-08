import React from 'react';
import { useRef } from 'react';
import { Grid, Typography, Paper, Container} from '@mui/material';
import ThreeScene from '../../Three/ThreeScene';
import example from '../../Example/example.json';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../Theme/Theme';


const Use = () => {
  const componentRef = useRef(null);
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
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 2, m: 1}} className="withBorder">
              <Typography variant="h6" gutterBottom>
              LiHO es una plataforma open-source que permite a la comunidad científica analizar, manipular y visualizar bases de datos científicas de manera tridimensional y multivariable. Procesa archivos .Csv y los transforma en archivos .gltf descargables, que se muestran en una plataforma web interactiva. LiHO es accesible para usuarios sin experiencia técnica gracias a su interfaz amigable y enfoque intuitivo. Además, brinda la posibilidad de descargar las visualizaciones en formato gltf.
              Su objetivo es facilitar el descubrimiento de nuevos conocimientos a partir de datos complejos y mejorar la calidad visual de las representaciones actuales.
              </Typography>
            </Paper>
          </Grid>

          {/* Right column */}
          <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 2, m: 1}} className="withBorder"><ThreeScene divRef={componentRef} apiData={example}/></Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>

);
}


export default Use;
