import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#23922c",
    },
    secondary: {
      main: "#341abd",
    },
  },

  shape: {
    borderRadius: 15,
  },
  components: {
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
          background: "linear-gradient(45deg, #388E3C 30%, #2E7D32 90%)",
          border: 0,
          borderRadius: 10,
          boxShadow:
            "0 4px 10px rgba(0, 0, 0, 0.25), 0 2px 4px rgba(0, 0, 0, 0.15)",
          color: "white",
          height: 35,
          padding: "0 30px",
        },
      },
    },
  },
});

export default theme;
