import React from "react";
import Panel from "../../../layout/panel";
import Skeleton from "../../../layout/skeleton";
import {LoadingContainer} from "./styles";

const LoadingInvitationItem = () => {
  return (
    <LoadingContainer>
      <Panel className="no-shadow">
        <header>
          <Skeleton className="avatar-skeleton" />
          <div className="column">
            <Skeleton className="row-skeleton" />
            <Skeleton className="row-skeleton" />
          </div>
        </header>
      </Panel>
    </LoadingContainer>
  );
};

export default LoadingInvitationItem;