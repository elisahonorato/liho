import LihoClient from './client/LihoClient';
import { ThemeProvider } from '@mui/material/styles';

import theme from './components/theme/theme'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Pages/Home'
import Header from './components/Header/Header';
import Tutorial from './components/Pages/Tutorial';
import { Container, Grid, Typography} from '@mui/material';


function App() {
  return (
    <LihoClient>
      <ThemeProvider theme={theme}>
        <Router>
          <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header />
            <Container maxWidth="xl" style={{ flexGrow: 1 }}>
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/tutorial" element={<Tutorial />} />
              </Routes>
            </Container>
            <footer style={{padding: "20px", marginTop: "auto" }}>
              <Typography variant="body1" align="center">
                © 2023 Liho. Todos los derechos reservados.
              </Typography>
            </footer>
          </div>
        </Router>
      </ThemeProvider>
    </LihoClient>
  );
}

export default App;

