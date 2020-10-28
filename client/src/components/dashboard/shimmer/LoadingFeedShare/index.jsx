import React from "react";

import Panel from "../../../layout/panel";
import Skeleton from "../../../layout/skeleton";

import {Container} from "./styles";

const LoadingFeedShare = () => {
  return (
    <Container>
      <Panel className="no-shadow">
        <Skeleton className="row-skeleton" />
        <Skeleton className="row-skeleton" />
      </Panel>
    </Container>
  );
};

export default LoadingFeedShare;
