import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Avatar, Column, Row, StyledLink} from "./styles";
import Grid from "@material-ui/core/Grid";
import {acceptConnect, ignoreConnect} from "../../../../redux/actions/profile";
import LoadingInvitationItem from "../loadingInvitationItem/LoadingInvitationItem";
import Button from "@material-ui/core/Button";

const InvitationItem = ({
                          acceptConnect,
                          ignoreConnect,
                          user,
                          avatar,
                          name,
                          status,
                          loadingProfiles
                        }) => {
  return (
    <>
      {loadingProfiles ? <LoadingInvitationItem /> :
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            <Row className="heading">
              <StyledLink to={`/profile/${user}`}>
                <Avatar src={avatar} alt="" />
              </StyledLink>
              <Column>
                <h3>{name}</h3>
                <h4>{status}</h4>
              </Column>
            </Row>
          </Grid>
          <Grid item>
            <Button size="small" onClick={() => ignoreConnect({"user": user})}> Ignore </Button>
            <Button variant="outlined" color="primary" size="small"
                    onClick={() => acceptConnect({"user": user})}> Accept </Button>
          </Grid>
        </Grid>}
    </>
  );
};

InvitationItem.propTypes = {
  acceptConnect: PropTypes.func.isRequired,
  ignoreConnect: PropTypes.func.isRequired
};

export default connect(null, {acceptConnect, ignoreConnect})(InvitationItem);

