import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import withRoot from "../landing/withRoot";
import {Field, Form, FormSpy} from "react-final-form";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "../landing/components/Typography";
import AppForm from "../landing/views/AppForm";
import RFTextField from "../landing/form/RFTextField";
import FormButton from "../landing/form/FormButton";
import FormFeedback from "../landing/form/FormFeedback";
import {createProfile} from "../../redux/actions/profile";
import {useHistory} from "react-router-dom";
import Grid from "@material-ui/core/Grid";

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

const ProfileForm = ({
                       createProfile,
                       auth
                     }) => {
  const history = useHistory();
  const classes = useStyles();

  const onSubmit = (formData) => {
    const {firstName, lastName, status, location, about, skills, githubusername} = formData;
    const name = firstName + " " + lastName;
    const newFormData = {name, status, location, about, skills, githubusername};
    createProfile(newFormData, history, auth.user._id);
  };

  return (
    <>
      <AppForm>
        <>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            Create profile
          </Typography>
        </>
        <Form onSubmit={onSubmit}
              initialValues={{location: "", about: "", skills: "", githubusername: ""}}
              subscription={{submitting: true}}>
          {({handleSubmit, submitting}) => (
            <form onSubmit={handleSubmit} className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Field
                    autoFocus
                    component={RFTextField}
                    disabled={submitting}
                    fullWidth
                    label="First Name"
                    name="firstName"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    component={RFTextField}
                    disabled={submitting}
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    required
                  />
                </Grid>
              </Grid>
              <Field
                component={RFTextField}
                disabled={submitting}
                placeholder="Your current status that shows on your profile..."
                fullWidth
                label="Status"
                margin="normal"
                name="status"
                size="large"
                required
              />
              <Field
                component={RFTextField}
                disabled={submitting}
                placeholder="Your current location [city, state, country]..."
                fullWidth
                label="Location"
                margin="normal"
                name="location"
                size="large"
                required
              />
              <Field
                component={RFTextField}
                disabled={submitting}
                placeholder="Describe who you are..."
                fullWidth
                label="About"
                margin="normal"
                name="about"
                size="large"
              />
              <Field
                component={RFTextField}
                disabled={submitting}
                placeholder="Your skills separate by [,]..."
                fullWidth
                label="Skills"
                margin="normal"
                name="skills"
                size="large"
              />
              <Field
                component={RFTextField}
                disabled={submitting}
                placeholder="Your GitHub username"
                fullWidth
                label="GitHub username"
                margin="normal"
                name="githubusername"
                size="large"
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
                {submitting ? "In progress…" : "Save"}
              </FormButton>
            </form>
          )}
        </Form>
      </AppForm>
    </>
  );
};


ProfileForm.propTypes = {
  createProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, {createProfile})(withRoot(ProfileForm));