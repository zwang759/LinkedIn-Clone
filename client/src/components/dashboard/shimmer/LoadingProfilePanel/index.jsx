import React from "react";

import Panel from "../../../layout/panel";
import Skeleton from "../../../layout/skeleton";

import {Container} from "./styles";

const LoadingProfilePanel = () => {
  return (
    <Container>
      <Panel className="no-shadow">
        <Skeleton className="bg-skeleton" />
        <span>
          <Skeleton className="avatar-skeleton" />
          <Skeleton className="row-skeleton" />
          <Skeleton className="row-skeleton" />
        </span>
      </Panel>
    </Container>
  );
};

export default LoadingProfilePanel;
