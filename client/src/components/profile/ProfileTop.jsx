import React from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import {AiOutlineCamera, AiOutlineLock} from "react-icons/ai";
import {BiPencil} from "react-icons/bi";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Popper from "@material-ui/core/Popper";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import MenuList from "@material-ui/core/MenuList";
import AddEducation from "../profile-forms/AddEducation";
import AddExperience from "../profile-forms/AddExperience";
import AvatarModal from "../profile-forms/AvatarModal";
import EditIntro from "../profile-forms/EditIntro";
import EditAbout from "../profile-forms/EditAbout";
import EditAvatar from "../profile-forms/EditAvatar";
import DialogModal from "../profile-forms/DialogModal";
import EditGitHub from "../profile-forms/EditGitHub";
import UpdateSkills from "../profile-forms/UpdateSkills";
import IconModal from "../layout/iconModal/IconModal";
import {addFollow, ConnectAndUpdateTargetProfile, removeConnection, removeFollow} from "../../redux/actions/profile";
import {connect} from "react-redux";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles({
  root: {
    marginTop: 100
  },
  top: {
    marginTop: -80
  },
  bot: {
    marginTop: -45,
    padding: 26.5
  },
  large: {
    width: 150,
    height: 150
  },
  reduceLeftMargin: {
    marginLeft: 0
  }
});

const ProfileTop = ({
                      ConnectAndUpdateTargetProfile,
                      addFollow,
                      removeFollow,
                      removeConnection,
                      profile: {
                        user,
                        name,
                        avatar,
                        backgroundMedia,
                        status,
                        location,
                        about,
                        skills,
                        githubusername,
                        followers,
                        invitationReceived,
                        connections
                      },
                      auth
                    }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const close = () => {
    setOpen(false);
  };

  const onClickConnect = () => {
    ConnectAndUpdateTargetProfile({"user": user});
  };

  const onClickFollow = () => {
    addFollow({"user": user});
  };

  const onClickUnfollow = () => {
    removeFollow({"user": user});
  };

  const onClickRemoveConnection = () => {
    removeConnection({"user": user});
  };

  // memorization avoid heavy computing during every rerender
  const isConnected = React.useMemo(() => {
      return (user === auth.user._id) ? false : connections.some(e => e.user === auth.user._id);
    },
    [auth.user._id, user, connections]);
  const isPending = React.useMemo(() => {
    return (user === auth.user._id) ? false : invitationReceived.some(e => e.user === auth.user._id);
  }, [auth.user._id, user, invitationReceived]);
  const isFollower = React.useMemo(() => {
    return (user === auth.user._id) ? false : followers.some(e => e.user === auth.user._id);
  }, [auth.user._id, user, followers]);

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt=""
          height="300"
          image={backgroundMedia}
        />
      </CardActionArea>
      <CardContent className={classes.top}>
        <Grid container justify="space-between" alignItems="center">
          <AvatarModal name="Edit Avatar" user={user} userId={auth.user._id} avatar={avatar}
                       content={<EditAvatar currAvatar={avatar} />} />
          <CardActions>
            {
              (auth.user._id !== user) ?
                <>
                  {isPending ?
                    <>
                      <Button variant="outlined" color="primary" disabled>Pending</Button>
                      <Button variant="outlined" color="primary">
                        <AiOutlineLock /> Message</Button>
                    </> :
                    isConnected ? <Button variant="contained" color="primary">Message</Button>
                      : <Button variant="contained" color="primary"
                                onClick={onClickConnect}>Connect</Button>
                  }
                  <Button
                    variant="outlined"
                    ref={anchorRef}
                    aria-controls={open ? "menu-list-grow" : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                  >
                    More...
                  </Button>
                  <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition
                          disablePortal>
                    {({TransitionProps, placement}) => (
                      <Grow
                        {...TransitionProps}
                        style={{transformOrigin: placement === "bottom" ? "center top" : "center bottom"}}
                      >
                        <Paper>
                          <ClickAwayListener onClickAway={handleClose}>
                            <MenuList autoFocusItem={open}>
                              {isFollower ?
                                <MenuItem
                                  onClick={onClickUnfollow}>Unfollow</MenuItem> :
                                <MenuItem onClick={onClickFollow}>Follow</MenuItem>
                              }
                              {isConnected &&
                              <MenuItem onClick={onClickRemoveConnection}>Remove
                                connection</MenuItem>}
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </>
                :
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    ref={anchorRef}
                    aria-controls={open ? "menu-list-grow" : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                  >
                    Add profile section
                  </Button>
                  <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition
                          disablePortal>
                    {({TransitionProps, placement}) => (
                      <Grow
                        {...TransitionProps}
                        style={{transformOrigin: placement === "bottom" ? "center top" : "center bottom"}}
                      >
                        <Paper>
                          <ClickAwayListener onClickAway={handleClose}>
                            <MenuList autoFocusItem={open}>
                              <DialogModal name="Intro"
                                           content={<EditIntro handleClose={close}
                                                               location={location}
                                                               status={status} />} />
                              <DialogModal name="About"
                                           content={<EditAbout handleClose={close}
                                                               about={about} />} />
                              <DialogModal name="Add experience"
                                           content={<AddExperience
                                             handleClose={close} />} />
                              <DialogModal name="Add education"
                                           content={<AddEducation handleClose={close} />} />
                              <DialogModal name="Add skills"
                                           content={<UpdateSkills handleClose={close}
                                                                  skills={skills} />} />
                              <DialogModal name="GitHub"
                                           content={<EditGitHub handleClose={close}
                                                                githubusername={githubusername} />} />
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </>
            }
            {auth.user._id === user &&
            <>
              <IconButton color="primary" component="span">
                <AiOutlineCamera size={30} />
              </IconButton>
              <IconModal icon={<BiPencil size={30} />}
                         content={<EditIntro status={status} location={location} />} />
            </>
            }
          </CardActions>
        </Grid>
      </CardContent>
      <CardContent className={classes.bot}>
        <Typography variant="h5" component="h2">
          {name}
        </Typography>
        <Typography variant="body1" component="p">
          {status}
        </Typography>
        <Typography variant="body1" component="p">
          {location} {connections.length} connections
        </Typography>
      </CardContent>
    </Card>
  );
};

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired,
  ConnectAndUpdateTargetProfile: PropTypes.func.isRequired,
  removeConnection: PropTypes.func.isRequired,
  addFollow: PropTypes.func.isRequired,
  removeFollow: PropTypes.func.isRequired,
  auth: PropTypes.object
};

export default connect(null, {ConnectAndUpdateTargetProfile, removeConnection, addFollow, removeFollow})(ProfileTop);
