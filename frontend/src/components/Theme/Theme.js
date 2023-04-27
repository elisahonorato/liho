
import { createTheme} from '@mui/material/styles';

const theme = createTheme({
    typography: {
      fontFamily: 'monospace',
      fontSize: 10,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      body1: {
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.75rem',
        fontWeight: 400,
        lineHeight: 1.5,
      },
      h1: {
        fontSize: '2rem',
        fontWeight: 400,
        lineHeight: 1.5,
      },
      p: {
        fontSize: '0.7rem',
        fontWeight: 300,
        lineHeight: 0.05,
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
    components: {
        MuiDivider: {
          styleOverrides: {
            root: {
              height: 0.5,
            backgroundColor: '#000000',

            },
          },
        },
    },


    })

  export default theme;
