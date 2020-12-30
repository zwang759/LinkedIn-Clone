import React from "react";
import spinner from "./spinner.gif";
import {SpinnerImage} from "./styles";

const SpinnerSmall = () => (
  <SpinnerImage
    src={spinner}
    alt="Loading..."
  />
);


export default SpinnerSmall;