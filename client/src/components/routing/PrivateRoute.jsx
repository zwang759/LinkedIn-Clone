import React from "react";
import {Redirect, Route} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import Spinner from "../layout/spinner";

const PrivateRoute = ({
                        component: Component,
                        auth: {isAuthenticated, loading},
                        ...rest
                      }) => {

  return (
    <Route
      {...rest}
      render={props =>
        loading ? (
          <Spinner />
        ) : isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/register" />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
