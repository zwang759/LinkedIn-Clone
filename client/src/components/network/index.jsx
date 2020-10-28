import React from "react";
import {Container} from "./styles";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import Spinner from "../layout/spinner";
import {Redirect} from "react-router-dom";
import ManageMyNetwork from "./manageMyNetwork/ManageMyNetwork";
import Invitation from "./invitation/Invitation";
import {getCurrentProfile} from "../../redux/actions/profile";


const Network = ({
                   profile: {profile, loadingProfile},
                   getCurrentProfile
                 }) => {

  React.useEffect(() => {
    getCurrentProfile();
  }, []);

  if (loadingProfile) {
    return (<Spinner />);
  } else if (profile === null) {
    return <Redirect to="/create-profile" />;
  } else {
    return (
      <Container>
        <main>
          <ManageMyNetwork connections={profile.connections} following={profile.following} followers={profile.followers}
                           loading={loadingProfile} />
          <Invitation profile={profile} loading={loadingProfile} />
        </main>
      </Container>
    );
  }
};

Network.propTypes = {
  profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  {getCurrentProfile})
(Network);