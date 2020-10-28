import {createMuiTheme} from "@material-ui/core/styles";
import {green, grey, red} from "@material-ui/core/colors";

const rawTheme = createMuiTheme({
  palette: {
    primary: {
      light: "#69696a",
      main: "#28282a",
      dark: "#1e1e1f"
    },
    secondary: {
      light: "#e2eef8",
      main: "#2196f3",
      dark: "#1976d2"
    },
    warning: {
      main: "#ffc071",
      dark: "#ffb25e"
    },
    error: {
      xLight: red[50],
      main: red[500],
      dark: red[700]
    },
    success: {
      xLight: green[50],
      main: green[500],
      dark: green[700]
    }
  },
  typography: {
    fontSize: 14,
    fontWeightLight: 300, // Work Sans
    fontWeightRegular: 400, // Work Sans
    fontWeightMedium: 700 // Roboto Condensed
  }
});

const theme = {
  ...rawTheme,
  palette: {
    ...rawTheme.palette,
    background: {
      ...rawTheme.palette.background,
      default: rawTheme.palette.common.white,
      placeholder: grey[200]
    }
  }
};

export default theme;