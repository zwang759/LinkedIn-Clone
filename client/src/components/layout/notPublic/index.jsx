import React from "react";
import {AiFillMeh} from "react-icons/ai";
import {Container, Separator, Span} from "./styles";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {setLoading} from "../../../redux/actions/profile";

const NotPublic = ({setLoading, user}) => {

  const OnClick = () => {
    setLoading();
  };

  return (
    <Container>
      <div>
        <Span>
          <AiFillMeh size={80} />
          <h2>An exact match for {user} could not be found.</h2>
        </Span>
        <p>The profile you're looking for isn't public or doesn't exist.
          To search and filter other members, <Link to="/login" onClick={OnClick}>log in </Link> or <Link to="/register"
                                                                                                          onClick={OnClick}>join
            today. </Link></p>
        <Separator />

        <Button component={Link} to="/" onClick={OnClick} variant="contained" color="primary">Back to home</Button>

      </div>
    </Container>
  );
};

NotPublic.propTypes = {
  setLoading: PropTypes.func.isRequired,
  user: PropTypes.string.isRequired
};

export default connect(null, {setLoading})(NotPublic);