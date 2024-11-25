import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./App.css";
import Layout from "./components/common/Layout/Layout";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      // main: "#18c5a9",
         main: "#d9534f",
      contrastText: "#fff",
    },
    sky: {
      main: "#5cc0ce",
      contrastText: "#fff",
    },
    secondary: {
      main: "#d9534f",
    },
    danger: {
      main: "#d9534f",
      contrastText: "#fff",
    },
    warning: {
      main: "#f39c12",
      contrastText: "#fff",
    },
    success: {
      main: "#00a65a",
      contrastText: "#fff",
    },
    error: {
      main: "#dd4b39",
      contrastText: "#fff",
    },
    accent: {
      main: "#5c6bc0",
      dark: "#304e7a", // Adjusted dark color
      contrastText: "#fff"
    },
    
    inherit: {
      main: "#f4f4f4",
      dark: "#000000",
      contrastText: "#444444",
    },
    gray: {
      main: "#dddddd",
      dark: "#cccccc",
      contrastText: "#000000",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "2px 12px",
     
                },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: "#555555",
          padding: "5px 10px 5px 10px",
          "&::before": {
            border: "1px solid rgba(0, 0, 0, 0.42)",
          },
          "&::focus": {
            border: "1px solid rgba(0, 0, 0, 0.42)",
          },
        },
      },
    },
    MuiSvgIcon: { 
      styleOverrides: {
        root: {
          fill: "#000000", 
        },
      },
    },
  },
  typography: {
    button: {
      textTransform: "none",
      fontFamily:'Lora'
    },
  },
  
});


function App() {
  return (
    <ThemeProvider theme={theme}>
      <Layout />
    </ThemeProvider>
  );
}

export default App;
