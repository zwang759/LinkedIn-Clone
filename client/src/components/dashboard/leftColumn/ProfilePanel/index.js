import React from "react";
import Panel from "../../../layout/panel";
import {Container} from "./styles";
import PropTypes from "prop-types";

const ProfilePanel = ({profile: {name, avatar, status, connections, views}}) =>
  (
    <Panel>
      <Container>
        <div className="profile-cover" />
        <img
          src={avatar}
          alt="Avatar"
          className="profile-picture"
        />
        <h1>{name}</h1>
        <h2>{status}</h2>

        <div className="separator" />

        <div className="key-value">
          <span className="key">Who viewed your profile</span>
          <span className="value">{views.length}</span>
        </div>
        <div className="key-value">
          <span className="key">Connections</span>
          <span className="value">{connections.length}</span>
        </div>
      </Container>
    </Panel>
  );

ProfilePanel.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfilePanel;