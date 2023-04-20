import { createTheme} from '@mui/material/styles';

const theme = createTheme({
    typography: {
      fontFamily: 'Roboto',
      fontSize: 10,
      body1: {
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.5,
      },
    },
    palette: {
        primary: {
            main: '#3f51b5',
        },
        secondary: {
            main: '#f50057',
        },
    },
  });


  export default theme;
