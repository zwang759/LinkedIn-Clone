import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Container} from "./styles";

const Spinner = () => (
  <Container>
    <h1> LinkedIn </h1>
    <CircularProgress size="10rem" thickness={6} />
  </Container>
);

export default Spinner;
