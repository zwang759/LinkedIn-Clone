import React, {useState} from "react";
import PropTypes from "prop-types";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";
import {BiPencil} from "react-icons/bi";
import IconModal from "../layout/iconModal/IconModal";
import EditAbout from "../profile-forms/EditAbout";
import {ABOUT_LIMIT} from "../../enum/enum";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    padding: 10
  },
  cursorToPointer: {
    cursor: "pointer"
  }
});

const ProfileAbout = ({
                        userId,
                        user,
                        about
                      }) => {
  const classes = useStyles();
  const [isHidden, setIsHidden] = useState(true);
  const showMore = () => setIsHidden(false);
  const showLess = () => setIsHidden(true);

  if (about && about.length <= ABOUT_LIMIT) {
    return (
      <Card className={classes.root}>
        <Grid container justify="space-between" alignItems="center">
          <CardContent>
            <Typography variant="h5" component="h2">About</Typography>
          </CardContent>
          {user === userId && <IconModal icon={<BiPencil size={30} />} content={<EditAbout about={about} />} />}
        </Grid>
        <CardContent>
          <Typography variant="body1" component="p">{about}</Typography>
        </CardContent>
      </Card>
    );
  } else if (isHidden) {
    const content = about.substring(0, ABOUT_LIMIT) + "...";
    return (
      <Card className={classes.root}>
        <Grid container justify="space-between" alignItems="center">
          <CardContent>
            <Typography variant="h5" component="h2">About</Typography>
          </CardContent>
          <IconModal icon={<BiPencil size={30} />} content={<EditAbout about={about} />} />
        </Grid>
        <CardContent>
          <Typography variant="body1" component="p">{content}
            <Link onClick={showMore}><span className={classes.cursorToPointer}>see more</span></Link>
          </Typography>
        </CardContent>
      </Card>
    );
  } else {
    return (
      <Card className={classes.root}>
        <Grid container justify="space-between" alignItems="center">
          <CardContent>
            <Typography variant="h5" component="h2">About</Typography>
          </CardContent>
          <IconModal icon={<BiPencil size={30} />} content={<EditAbout about={about} />} />
        </Grid>
        <CardContent>
          <Typography variant="body1" component="p">{about}
            <Link onClick={showLess}><span className={classes.cursorToPointer}>see less</span></Link>
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

ProfileAbout.propTypes = {
  user: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  about: PropTypes.string.isRequired
};

export default ProfileAbout;
