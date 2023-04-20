
import { createTheme} from '@mui/material/styles';

const theme = createTheme({
    typography: {
      fontFamily: 'monospace',
      fontSize: 10,
      body1: {
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.5,
      },
    },
    palette: {
        primary: {
            main: '#ffffff',
            light: '#ffffff',
            dark: '#000000',
        },
        secondary: {
            main: '#808080',
        },
    },
    shape: {
        borderRadius: 20,
    },
    spacing: 10,
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
  });


  export default theme;
