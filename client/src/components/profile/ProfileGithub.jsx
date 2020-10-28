import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getGithubRepos} from "../../redux/actions/profile";
import moment from "moment";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {AiFillStar, AiOutlineFork} from "react-icons/ai";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import {BiChevronDown, BiChevronUp, BiPencil} from "react-icons/bi";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import CardActionArea from "@material-ui/core/CardActionArea";
import LoadingFeedShare from "../dashboard/shimmer/LoadingFeedShare";
import IconModal from "../layout/iconModal/IconModal";
import EditGitHub from "../profile-forms/EditGitHub";
import {GITHUBREPOS_LIMIT} from "../../enum/enum";

const useStyles = makeStyles({
  root: {
    padding: 10
  },
  center: {
    justifyContent: "center"
  },
  wrapIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  alignIcon: {
    display: "flex",
    alignItems: "center"
  }
});

const format = (isoDate) => {
  return moment(isoDate).format("MMMM, YYYY");
};

const ProfileGithub = ({username, getGithubRepos, repos, loadingRepos}) => {
  useEffect(() => {
    getGithubRepos(username);
  }, [username]);

  const classes = useStyles();
  const [isHidden, setIsHidden] = useState(true);
  const showMore = () => setIsHidden(false);
  const showLess = () => setIsHidden(true);

  const title = (
    <Grid container justify="space-between" alignItems="center">
      <CardContent>
        <Typography variant="h5">Github Repos</Typography>
      </CardContent>
      <Grid item>
        <IconModal icon={<BiPencil size={30} />} content={<EditGitHub githubusername={username} />} />
      </Grid>
    </Grid>
  );

  const repoInfo = (repos) => (
    <Card className={classes.root}>
      {title}
      {repos.map((repo) => (
        <CardContent key={repo.id}>
          <CardActionArea component='a' href={repo.html_url} target="_blank" rel="noopener noreferrer">
            <Typography variant="body1">
              {repo.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">{format(repo.created_at)}</Typography>
            <Typography variant="body2" color="textSecondary" className={classes.alignIcon}>
              <AiFillStar /> Stars: {repo.stargazers_count} &nbsp;
              <AiOutlineFork /> Forks: {repo.forks_count}
            </Typography>
            <Typography variant="body2" component="p">{repo.description}</Typography>
          </CardActionArea>
        </CardContent>
      ))}
    </Card>
  );

  if (loadingRepos) {
    return (
      <>
        {title}
        <CardContent>
          <LoadingFeedShare />
          <LoadingFeedShare />
          <LoadingFeedShare />
        </CardContent>
      </>
    );
  } else if (repos.length === 0) {
    return (<> </>);
  } else if (repos && repos.length <= GITHUBREPOS_LIMIT) {
    return repoInfo(repos);
  } else if (isHidden) {
    const collections = repos.slice(0, GITHUBREPOS_LIMIT);
    return (
      <>
        {repoInfo(collections)}
        <Card variant="outlined">
          <CardActions className={classes.center}>
            <CardActionArea onClick={showMore}>
              <Typography variant="body1" color="primary" className={classes.wrapIcon}>
                Show more <BiChevronDown />
              </Typography>
            </CardActionArea>
          </CardActions>
        </Card>
      </>
    );
  } else {
    return (
      <>
        {repoInfo(repos)}
        <Card variant="outlined">
          <CardActions className={classes.center}>
            <CardActionArea onClick={showLess}>
              <Typography variant="body1" color="primary" className={classes.wrapIcon}>
                Show less <BiChevronUp />
              </Typography>
            </CardActionArea>
          </CardActions>
        </Card>
      </>
    );
  }
};

ProfileGithub.propTypes = {
  getGithubRepos: PropTypes.func.isRequired,
  repos: PropTypes.array.isRequired,
  loadingRepos: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  repos: state.profile.repos,
  loadingRepos: state.profile.loadingRepos
});

export default connect(mapStateToProps, {getGithubRepos})(ProfileGithub);
