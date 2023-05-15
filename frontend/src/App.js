import LihoClient from './client/LihoClient';
import { ThemeProvider } from '@mui/material/styles';

import theme from './components/theme/theme'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Pages/Home'
import Header from './components/Header/Header';
import Tutorial from './components/Pages/Tutorial';
import { Container } from '@mui/material';

function App() {
  return (
    <LihoClient>
      <ThemeProvider theme={theme}>
        <Router>
          <Header />
          <Container maxWidth="xl">
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/tutorial" element={<Tutorial />} />
            </Routes>
          </Container>
        </Router>
      </ThemeProvider>
    </LihoClient>
  );
}

export default App;
