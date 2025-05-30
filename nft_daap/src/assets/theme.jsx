import { createTheme } from '@mui/material/styles';
import { orange, green } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: orange[600],
    },
    secondary: {
      main: '#14213D',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#555555',
    },
  },
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    h1: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    button: {
      textTransform: 'none', // no uppercase on buttons
      fontWeight: 600,
    },
  },
  spacing: 8,  // default spacing multiplier
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // boxShadow: 'none',
          fontSize: {
            xs: '0.875rem',
            md: '1rem',
          },
          borderRadius: 2,
          color:'#fff',
          // border:'4px solid #aaa',
          '&:hover': {
            // boxShadow: 'none'
            backgroundColor: orange[700]
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 0,
          '& fieldset': {
            borderColor: theme.palette.primary.main,
          },
          '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
            borderWidth: 2,
          },
          '& input': {
            color: '#fff',     // Main input text color
            opacity: 0.8,
          },
        }),
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: '#fff',
          opacity: 0.4,  // faded effect
          '&.Mui-focused': {
            color: theme.palette.primary.main,
            opacity: 1,   // fully visible on focus
          },
        }),
      },
    },
  },
});

export default theme;
