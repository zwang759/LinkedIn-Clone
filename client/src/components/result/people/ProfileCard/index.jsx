import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import {Avatar, Column, Row, StyledLink} from "./styles";
import {connect} from "react-redux";
import {ConnectAndUpdateCurrProfile} from "../../../../redux/actions/profile";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  root: {
    textTransform: "none"
  }
});

const ProfileCard = ({
                       auth,
                       ConnectAndUpdateCurrProfile,
                       connections,
                       invitationSent,
                       invitationReceived,
                       user,
                       avatar,
                       name,
                       status,
                       location
                     }) => {
  const classes = useStyles();

  const isConnected = React.useMemo(() =>
      (auth.user._id === user) ? false : connections.some(e => e.user === user),
    [auth.user._id, user, connections]
  );
  const isPending = React.useMemo(() =>
      (auth.user._id === user) ? false : invitationSent.some(e => e.user === user),
    [auth.user._id, user, invitationSent]
  );

  const receivedInvite = React.useMemo(() =>
      (auth.user._id === user) ? false : invitationReceived.some(e => e.user === user),
    [auth.user._id, user, invitationReceived]
  );

  const onClickConnect = () => {
    ConnectAndUpdateCurrProfile({"user": user});
  };

  return (
    <Grid container justify="space-between" alignItems="center">
      <Grid item>
        <Row className="heading">
          <StyledLink to={`/profile/${user}`}>
            <Avatar src={avatar} alt="" />
          </StyledLink>
          <Column>
            <h3>{name}</h3>
            <h4>{status}</h4>
            <h4>{location}</h4>
          </Column>
        </Row>
      </Grid>
      {auth.user._id !== user && <Grid item>
        {isPending ?
          <Button variant="outlined" color="primary" className={classes.root} size="small"
                  disabled> Invite Sent </Button>
          : isConnected ?
            <Button variant="outlined" color="primary" className={classes.root}
                    size="small"> Message </Button>
            : receivedInvite ?
              <> </>
              :
              <Button variant="outlined" color="primary" onClick={onClickConnect}
                      className={classes.root}
                      size="small"> Connect </Button>
        }
      </Grid>}
    </Grid>
  );
};

ProfileCard.propTypes = {
  connections: PropTypes.array.isRequired,
  invitationSent: PropTypes.array.isRequired,
  user: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  ConnectAndUpdateCurrProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {ConnectAndUpdateCurrProfile})(ProfileCard);