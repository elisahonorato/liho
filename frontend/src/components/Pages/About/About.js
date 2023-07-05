import React from 'react';
import { useRef } from 'react';
import { Typography, Container, Box } from '@mui/material';
import ThreeScene from '../../Three/ThreeScene';
import example from '../../Example/example.json';


const Use = () => {
  const componentRef = useRef(null);

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          About Us
        </Typography>
        
        <ThreeScene divRef={componentRef} apiData={example} /> {/* Render the ModelComponent */}
        <Typography variant="body1" gutterBottom>
          LiHO es una plataforma open-source que permite a la comunidad científica analizar, manipular y visualizar bases de datos científicas de manera tridimensional y multivariable. Procesa archivos .Csv y los transforma en archivos .gltf descargables, que se muestran en una plataforma web interactiva. LiHO es accesible para usuarios sin experiencia técnica gracias a su interfaz amigable y enfoque intuitivo. Además, brinda la posibilidad de descargar las visualizaciones en formato gltf.
          Su objetivo es facilitar el descubrimiento de nuevos conocimientos a partir de datos complejos y mejorar la calidad visual de las representaciones actuales.
        </Typography>

      </Box>
    </Container>
  );
};

export default Use;
