import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {Layout, Row, Separator} from "./styles";
import Button from "@material-ui/core/Button";
import Typography from "./components/Typography";
import Spinner from "../layout/spinner";

const Landing = ({auth}) => {
  if (auth.loading) {
    return (
      <>
        <Spinner />
      </>
    );
  } else if (auth.isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <>
      <Layout>
        <Typography variant="h3" align="center">
          LinkedIn Clone
        </Typography>

        <Separator />

        <Typography variant="h4" align="center">
          Create a profile, share posts, and connect to other developers
        </Typography>

        <Separator />

        <Row>
          <Button component={Link} to="/register" variant="contained" color="primary">Sign Up</Button>

          <Separator />

          <Button component={Link} to="/login" variant="contained" color="primary">Sign In</Button>
        </Row>
      </Layout>
    </>
  );
};


Landing.propTypes = {
  auth: PropTypes.object
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Landing);