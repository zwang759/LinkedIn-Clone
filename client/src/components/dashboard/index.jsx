import React from "react";
import LeftColumn from "./leftColumn";
import MiddleColumn from "./middleColumn";
import RightColumn from "./rightColumn";
import {Container} from "./styles";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import Spinner from "../layout/spinner";
import {Redirect} from "react-router-dom";
import {getCurrentProfile} from "../../redux/actions/profile";

const Dashboard = ({
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
          <LeftColumn profile={profile} loading={loadingProfile} />
          <MiddleColumn />
          <RightColumn />
        </main>
      </Container>
    );
  }
};

Dashboard.propTypes = {
  profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  {getCurrentProfile})
(Dashboard);