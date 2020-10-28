import React, {useEffect} from "react";
import Panel from "../../layout/panel";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getProfilesByUserIds} from "../../../redux/actions/profiles";
import {makeStyles} from "@material-ui/core/styles";
import {Container, Separator} from "./styles";
import InvitationItem from "./invitationItem/InvitationItem";
import {INVITATION_LIMIT} from "../../../enum/enum";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  root: {
    margin: "0px 24px 16px"
  },
  panel: {
    padding: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  left: {
    float: "left"
  },
  right: {
    float: "right"
  }
});

const Invitation = ({
                      getProfilesByUserIds,
                      profile: {invitationReceived},
                      profiles: {profiles, loadingProfiles}
                    }) => {

  const classes = useStyles();

  useEffect(() => {
    const userIds = invitationReceived.map(obj => obj.user);
    getProfilesByUserIds(userIds);
  }, []);

  return (
    <Container className={classes.root}>
      <Panel className={classes.panel}>
        <span className={classes.left}>Invitations</span>
        <Button size="small" className={classes.right}>See all {invitationReceived.length}</Button>
      </Panel>
      <Panel>
        {profiles.slice(0, INVITATION_LIMIT).map(profile =>
          <React.Fragment key={profile.user}>
            <InvitationItem
              user={profile.user}
              avatar={profile.avatar}
              name={profile.name}
              status={profile.status}
              loadingProfiles={loadingProfiles}
            />
            <Separator />
          </React.Fragment>
        )}
      </Panel>
    </Container>
  );
};

Invitation.propTypes = {
  profile: PropTypes.object.isRequired,
  profiles: PropTypes.object.isRequired,
  getProfilesByUserIds: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  profiles: state.profiles
});

export default connect(mapStateToProps, {getProfilesByUserIds})(Invitation);

