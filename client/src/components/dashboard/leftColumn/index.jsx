import React from "react";
import LoadingProfilePanel from "../shimmer/LoadingProfilePanel";
import ProfilePanel from "./ProfilePanel";
import HashtagPanel from "./HashtagPanel";
import {Container} from "./styles";

const LeftColumn = ({profile, loading}) =>
  (
    <Container className="left-column">
      {loading ? (
        <LoadingProfilePanel />
      ) : (
        <>
          <ProfilePanel profile={profile} />
          <HashtagPanel />
        </>
      )}
    </Container>
  );

export default LeftColumn;
