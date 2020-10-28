import React from "react";
import {ThemeProvider} from "@material-ui/core/styles";
import theme from "./theme";

export default function withRoot(Component) {
  function WithRoot(props) {
    return (
      <ThemeProvider theme={theme}>
        <Component {...props} />
      </ThemeProvider>
    );
  }

  return WithRoot;
}