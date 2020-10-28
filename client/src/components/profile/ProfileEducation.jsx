import React, {useState} from "react";
import PropTypes from "prop-types";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import moment from "moment";
import Box from "@material-ui/core/Box";
import {makeStyles} from "@material-ui/core/styles";
import {BiPencil} from "react-icons/bi";
import Grid from "@material-ui/core/Grid";
import IconModal from "../layout/iconModal/IconModal";
import EditEducation from "../profile-forms/EditEducation";
import {DESCRIPTION_LIMIT} from "../../enum/enum";

const format = (isoDate) => {
  return moment(isoDate).format("MMMM, YYYY");
};

const useStyles = makeStyles({
  root: {
    wordBreak: "break-word",
    maxWidth: "92%"
  },
  boldTypography: {
    fontWeight: "inherit"
  },
  reduceTopMargin: {
    marginTop: -26
  },
  cursorToPointer: {
    cursor: "pointer"
  }
});

const ProfileEducation = ({
                            user,
                            userId,
                            education
                          }) => {
  const [isHidden, setIsHidden] = useState(true);
  const showMore = () => setIsHidden(false);
  const showLess = () => setIsHidden(true);
  const classes = useStyles();
  const {school, degree, fieldofstudy, current, to, from, description} = education;
  if (!description || description.length <= DESCRIPTION_LIMIT) {
    return (
      <Grid container justify="space-between">
        <CardContent className={classes.root}>
          <Box fontWeight={700}>
            <Typography variant="body1" className={classes.boldTypography}>{school}</Typography>
          </Box>
          <Typography variant="body2">{degree}, {fieldofstudy}</Typography>
          <Typography variant="body2"
                      color="textSecondary">{format(from)} - {current ? "Present" : format(to)}</Typography>
          <Typography variant="body2" component="p">{description}</Typography>
        </CardContent>
        <Grid item>
          {userId === user &&
          <IconModal icon={<BiPencil size={30} />} content={<EditEducation education={education} />} />}
        </Grid>
      </Grid>
    );
  } else if (isHidden) {
    const content = description.substring(0, DESCRIPTION_LIMIT) + "...";
    return (
      <Grid container justify="space-between">
        <CardContent className={classes.root}>
          <Box fontWeight={700}>
            <Typography variant="body1" className={classes.boldTypography}>{school}</Typography>
          </Box>
          <Typography variant="body2">{degree}, {fieldofstudy}</Typography>
          <Typography variant="body2"
                      color="textSecondary">{format(from)} - {current ? "Present" : format(to)}</Typography>
          <Typography variant="body2" component="p">
            {content} <Link onClick={showMore} className={classes.cursorToPointer}>see more</Link>
          </Typography>
        </CardContent>
        <Grid item>
          <IconModal icon={<BiPencil size={30} />} content={<EditEducation education={education} />} />
        </Grid>
      </Grid>
    );
  } else {
    return (
      <>
        <Grid container justify="space-between">
          <CardContent className={classes.root}>
            <Box fontWeight={700}>
              <Typography variant="body1" className={classes.boldTypography}>{school}</Typography>
            </Box>
            <Typography variant="body2">{degree}, {fieldofstudy}</Typography>
            <Typography variant="body2"
                        color="textSecondary">{format(from)} - {current ? "Present" : format(to)}</Typography>
            <Typography variant="body2" component="p">{description}</Typography>
          </CardContent>
          <Grid item>
            <IconModal name icon={<BiPencil size={30} />} content={<EditEducation education={education} />} />
          </Grid>
        </Grid>
        <CardContent className={classes.reduceTopMargin}>
          <Link onClick={showLess} className={classes.cursorToPointer}>see less</Link>
        </CardContent>
      </>
    );
  }
};

ProfileEducation.propTypes = {
  user: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  education: PropTypes.object.isRequired
};

export default ProfileEducation;
