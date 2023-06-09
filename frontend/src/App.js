import React from 'react';
import LihoClient from './client/LihoClient';
import { ThemeProvider } from '@mui/material/styles';


import theme from './components/Theme/Theme';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Pages/Home'
import Header from './components/Header/Header';
import Tutorial from './components/Pages/Tutorial';
import { Container, Typography} from '@mui/material';



function App() {
  return (
    <LihoClient>
      <ThemeProvider theme={theme}>
        <Router>
        <Header />
          <Container maxWidth="xl" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/liho" element={<Home />} />
            <Route path="/tutorial" element={<Tutorial />} />
          </Routes>
          <footer style={{padding: "20px", marginTop: "auto" }}>
            <Typography variant="body1" align="center">
                © 2023 Liho. Todos los derechos reservados.
              </Typography>
          </footer>
          </Container>

        </Router>
      </ThemeProvider>
    </LihoClient>
  );
}

export default App;

