import React from "react";
import TrendingPanel from "./TrendingPanel";

import {Container} from "./styles";

const RightColumn = () => {
  return (
    <Container className="right-column">
      <TrendingPanel />
    </Container>
  );
};

export default RightColumn;
