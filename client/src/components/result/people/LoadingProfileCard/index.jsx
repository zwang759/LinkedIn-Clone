import React from "react";
import Panel from "../../../layout/panel";
import Skeleton from "../../../layout/skeleton";
import {Container} from "./styles";

const LoadingProfileCard = () => {
  return (
    <Container>
      <Panel className="no-edge">
        <header>
          <Skeleton className="avatar-skeleton" />
          <div className="column">
            <Skeleton className="row-skeleton" />
            <Skeleton className="row-skeleton" />
            <Skeleton className="row-skeleton" />
          </div>
        </header>
      </Panel>
    </Container>
  );
};

export default LoadingProfileCard;