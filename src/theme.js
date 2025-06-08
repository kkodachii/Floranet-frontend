import { createTheme } from "@mui/material/styles";

const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: "#23922c",
      light: "#4caf50",
      dark: "#1b5e20",
    },
    secondary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    background: {
      default: mode === 'light' ? '#f5f5f5' : '#0a1929',
      paper: mode === 'light' ? '#ffffff' : '#132f4c',
    },
    text: {
      primary: mode === 'light' ? '#424242' : '#fff',
      secondary: mode === 'light' ? '#424242' : 'rgba(255, 255, 255, 0.7)',
    },
  },
  shape: {
    borderRadius: 15,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: 'background-color 0.3s ease-in-out',
        },
        '*': {
          '&:focus': {
            outline: 'none !important',
          },
          '&:focus-visible': {
            outline: 'none !important',
          },
          '&:focus-within': {
            outline: 'none !important',
          },
          '&:active': {
            outline: 'none !important',
          }
        }
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 46,
          height: 27,
          padding: 0,
          margin: 8,
        },
        switchBase: {
          padding: 1,
          "&$checked, &$colorPrimary$checked, &$colorSecondary$checked": {
            transform: "translateX(16px)",
            color: "#fff",
            "& + $track": {
              opacity: 1,
              border: "none",
            },
          },
        },
        thumb: {
          width: 24,
          height: 24,
        },
        track: {
          borderRadius: 13,
          border: "1px solid #bdbdbd",
          backgroundColor: "#fafafa",
          opacity: 1,
          transition:
            "background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#23922c",
          border: 0,
          borderRadius: 10,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.25), 0 2px 4px rgba(0, 0, 0, 0.15)",
          color: "white",
          height: 35,
          padding: "0 30px",
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            backgroundColor: "#1b5e20",
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)',
          },
          '&:focus': {
            outline: 'none !important',
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.25), 0 2px 4px rgba(0, 0, 0, 0.15)",
          },
          '&:focus-visible': {
            outline: 'none !important',
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.25), 0 2px 4px rgba(0, 0, 0, 0.15)",
          },
          '&:focus-within': {
            outline: 'none !important',
          },
          '&:active': {
            outline: 'none !important',
          }
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        },
      },
    },
  },
});

export default getTheme;
