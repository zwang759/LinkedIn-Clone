import React, {useEffect} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import ProfileExperience from "./ProfileExperience";
import ProfileEducation from "./ProfileEducation";
import ProfileGithub from "./ProfileGithub";
import {getProfileById} from "../../redux/actions/profile";
import Spinner from "../layout/spinner";
import Grid from "@material-ui/core/Grid";
import {GoPlus} from "react-icons/go";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import ProfileSkills from "./ProfileSkills";
import makeStyles from "@material-ui/core/styles/makeStyles";
import NotPublic from "../layout/notPublic";
import IconModal from "../layout/iconModal/IconModal";
import AddExperience from "../profile-forms/AddExperience";
import AddEducation from "../profile-forms/AddEducation";

const useStyles = makeStyles({
  root: {
    margin: "30px 12px 30px 84px"
  },
  padding: {
    padding: 10
  },
  Separator: {
    width: "100%",
    height: 16
  }
});

const Profile = ({getProfileById, profile: {profile, loadingProfile}, auth, match}) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, [match.params.id]);

  const classes = useStyles();

  if (auth.loading || loadingProfile) {
    return (<Spinner />);
  } else {
    return (
      <>
        {(!loadingProfile && !auth.loading && !auth.isAuthenticated) ? <NotPublic user={match.params.id} /> :
          <>
            <Grid item xs={8} className={classes.root}>

              <ProfileTop profile={profile} auth={auth} />
              <div className={classes.Separator} />
              {
                profile.about.length > 0 &&
                <>
                  <ProfileAbout user={profile.user} userId={auth.user._id} about={profile.about} />
                  <div className={classes.Separator} />
                </>
              }
              {
                profile.experience.length > 0 &&
                <>
                  <Card className={classes.padding}>
                    <Grid container justify="space-between" alignItems="center">
                      <CardContent>
                        <Typography variant="h5">Experience</Typography>
                      </CardContent>
                      <Grid item>
                        <IconModal icon={<GoPlus size={30} />} content={<AddExperience />} />
                      </Grid>
                    </Grid>

                    {profile.experience.map(experienceItem => (
                      <ProfileExperience
                        key={experienceItem._id}
                        user={profile.user}
                        userId={auth.user._id}
                        experience={experienceItem}
                      />
                    ))}
                  </Card>
                  <div className={classes.Separator} />
                </>
              }

              {
                profile.education.length > 0 &&
                <>
                  <Card className={classes.padding}>
                    <Grid container justify="space-between" alignItems="center">
                      <Grid item>
                        <CardContent>
                          <Typography variant="h5">Education</Typography>
                        </CardContent>
                      </Grid>
                      <Grid item>
                        <IconModal icon={<GoPlus size={30} />} content={<AddEducation />} />
                      </Grid>
                    </Grid>
                    {profile.education.map(educationItem => (
                      <ProfileEducation
                        key={educationItem._id}
                        user={profile.user}
                        userId={auth.user._id}
                        education={educationItem}
                      />
                    ))}
                  </Card>
                  <div className={classes.Separator} />
                </>
              }
              {
                profile.skills.length > 0 &&
                <>
                  <ProfileSkills
                    user={profile.user}
                    userId={auth.user._id}
                    skills={profile.skills}
                  />
                  <div className={classes.Separator} />
                </>
              }

              {profile.githubusername.length > 0 && (
                <ProfileGithub username={profile.githubusername} />
              )}

            </Grid>
          </>
        }
      </>
    );
  }
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, {getProfileById})(Profile);
