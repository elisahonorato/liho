import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Space Mono, monospace',
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
      main: '#B2B2B2',
    },
    background: {
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 20,
  },
  spacing: 5,
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
          backgroundColor: '#B2B2B2',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          // Style for Paper component without border
          '&.noBorder': {
            border: 'none',
          },
          // Style for Paper component with border
          '&.withBorder': {
            border: '1.3px solid #B2B2B2',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          // Button styles
          textTransform: 'uppercase',
          borderRadius: '20px',
          backgroundColor: '#B2B2B2',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#000000',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#B2B2B2',
          textDecoration: 'none',
          '&:hover': {
            color: '#000000',
          },
        },
      },
    },
  },
});

export default theme;
