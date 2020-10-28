import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Container} from "./styles";

const Alert = ({alerts}) =>
  alerts.map(alert => (
    <Container key={alert.id} className={alert.alertType}>
      {alert.msg}
    </Container>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  alerts: state.alert
});

export default connect(mapStateToProps)(Alert);
