import { Link } from 'react-router-dom';
import { Typography, Container, Box, Button } from '@mui/material';
import MuiTable from './MuiTable';

export default function Tutorial() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Ejemplo de Tabla
        </Typography>
        <Typography variant="body1" align="justify" gutterBottom>
          Esta es una tabla de ejemplo con datos generados aleatoriamente. Cada fila representa una muestra, y las variables son valores numéricos aleatorios entre 0 y 1 con una precisión de 3 decimales. Puedes personalizar esta tabla y sus datos según tus necesidades.
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <MuiTable />
      </Box>
      <Box sx={{ mb: 4, display: 'grid', gap: 20, justifyContent: 'center', alignItems: 'center' }}>
        <Button component={Link} to="/" variant="contained">
            Generar Gráfico
        </Button>
    </Box>


    </Container>
  );
}
