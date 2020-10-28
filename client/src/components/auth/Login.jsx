import React from "react";
import {Link, Redirect} from "react-router-dom";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {login} from "../../redux/actions/auth";
import withRoot from "../landing/withRoot";
import {Field, Form, FormSpy} from "react-final-form";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "../landing/components/Typography";
import AppForm from "../landing/views/AppForm";
import {required, validEmail} from "../landing/form/validation";
import RFTextField from "../landing/form/RFTextField";
import FormButton from "../landing/form/FormButton";
import FormFeedback from "../landing/form/FormFeedback";

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: theme.spacing(6)
  },
  button: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2)
  },
  feedback: {
    marginTop: theme.spacing(2)
  }
}));

const Login = ({login, auth}) => {

  const classes = useStyles();

  const validate = (values) => {
    const errors = required(["email", "password"], values);

    if (!errors.email) {
      const emailError = validEmail(values.email, values);
      if (emailError) {
        errors.email = validEmail(values.email, values);
      }
    }

    return errors;
  };

  const onSubmit = (formData) => {
    login(formData);
  };

  if (auth.isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <>
      <AppForm>
        <Typography variant="h3" gutterBottom marked="center" align="center">
          Sign In
        </Typography>
        <Typography variant="body2" align="center">
          Don't have an account?
          <Link to="/register" style={{margin: 12}}>
            Sign Up here
          </Link>
        </Typography>

        <Form onSubmit={onSubmit} subscription={{submitting: true}} validate={validate}>
          {({handleSubmit, submitting}) => (
            <form onSubmit={handleSubmit} className={classes.form} noValidate>
              <Field
                autoComplete="email"
                autoFocus
                component={RFTextField}
                disabled={submitting}
                fullWidth
                label="Email"
                margin="normal"
                name="email"
                required
                size="large"
              />
              <Field
                fullWidth
                size="large"
                component={RFTextField}
                disabled={submitting}
                required
                name="password"
                autoComplete="current-password"
                label="Password"
                type="password"
                margin="normal"
              />
              <FormSpy subscription={{submitError: true}}>
                {({submitError}) =>
                  submitError ? (
                    <FormFeedback className={classes.feedback} error>
                      {submitError}
                    </FormFeedback>
                  ) : null
                }
              </FormSpy>
              <FormButton
                className={classes.button}
                disabled={submitting}
                size="large"
                color="secondary"
                fullWidth
              >
                {submitting ? "In progress…" : "Sign In"}
              </FormButton>
            </form>
          )}
        </Form>
      </AppForm>
    </>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, {login})(withRoot(Login));
