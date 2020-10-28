import React from "react";

import Skeleton from "../../../layout/skeleton";

import {Container} from "./styles";

const LoadingTrendingPanel = () => {
  const Row = () => (
    <div className="row">
      <Skeleton className="square-skeleton white" />

      <div className="column">
        <Skeleton className="row-skeleton white" />
        <Skeleton className="row-skeleton white" />
      </div>
    </div>
  );

  return (
    <Container>
      <Row />
      <Row />
      <Row />
    </Container>
  );
};

export default LoadingTrendingPanel;
