import React from "react";
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {setAlert} from "../../redux/actions/alert";
import {register} from "../../redux/actions/auth";
import PropTypes from "prop-types";
import AppForm from "../landing/views/AppForm";
import Typography from "../landing/components/Typography";
import {Field, Form, FormSpy} from "react-final-form";
import RFTextField from "../landing/form/RFTextField";
import FormFeedback from "../landing/form/FormFeedback";
import FormButton from "../landing/form/FormButton";
import {required, validEmail} from "../landing/form/validation";
import makeStyles from "@material-ui/core/styles/makeStyles";
import withRoot from "../landing/withRoot";

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

const Register = ({setAlert, register, auth}) => {

  const classes = useStyles();

  const validate = (values) => {
    const errors = required(["email", "password", "password2"], values);

    if (!errors.email) {
      const emailError = validEmail(values.email, values);
      if (emailError) {
        errors.email = validEmail(values.email, values);
      }
    }

    return errors;
  };

  const onSubmit = (formData) => {
    const {email, password, password2} = formData;
    if (password !== password2) {
      setAlert("Passwords do not match", "danger");
    } else {
      register({email, password});
    }
  };

  if (auth.isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  const minLength = min => value => ((value && value.length < min) ? `Must have at least ${min} characters` : undefined);

  return (
    <>
      <AppForm>
        <>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            Sign Up
          </Typography>
          <Typography variant="body2" align="center">
            <Link to="/login" style={{margin: 12}}>
              Already have an account?
            </Link>
          </Typography>
        </>
        <Form onSubmit={onSubmit} subscription={{submitting: true}} validate={validate}>
          {({handleSubmit, submitting}) => (
            <form onSubmit={handleSubmit} className={classes.form} noValidate>
              <Field
                autoComplete="email"
                component={RFTextField}
                disabled={submitting}
                fullWidth
                label="Email"
                margin="normal"
                name="email"
                required
              />
              <Field
                fullWidth
                component={RFTextField}
                disabled={submitting}
                name="password"
                autoComplete="current-password"
                label="Password"
                type="password"
                margin="normal"
                required
                validate={minLength(6)}
              />
              <Field
                fullWidth
                component={RFTextField}
                disabled={submitting}
                name="password2"
                autoComplete="confirm-password"
                label="Confirm Password"
                type="password"
                margin="normal"
                required
                validate={minLength(6)}
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
                color="secondary"
                fullWidth
              >
                {submitting ? "In progress…" : "Sign Up"}
              </FormButton>
            </form>
          )}
        </Form>
      </AppForm>
    </>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, {setAlert, register})(withRoot(Register));
