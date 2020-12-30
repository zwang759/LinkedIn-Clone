import React from "react";
import {AiFillMeh} from "react-icons/ai";
import {Container, Separator, Span} from "./styles";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";

const NotFound = () => {

  return (
    <Container>
      <div>
        <Span>
          <AiFillMeh size={80} />
          <h2>Page Not Found</h2>
        </Span>
        <p>Sorry, maybe the page you are looking for has been removed, or you typed in the wrong URL</p>
        <Separator />
        <Button component={Link} to="/" variant="contained" color="primary">Back to home</Button>
      </div>
    </Container>
  );
};

export default NotFound;