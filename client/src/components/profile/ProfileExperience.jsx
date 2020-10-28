import React, {useState} from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import moment from "moment";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import {BiPencil} from "react-icons/bi";
import IconModal from "../layout/iconModal/IconModal";
import EditExperience from "../profile-forms/EditExperience";
import {DESCRIPTION_LIMIT} from "../../enum/enum";

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

const format = (isoDate) => {
  return moment(isoDate).format("MMMM, YYYY");
};

const ProfileExperience = ({
                             user,
                             userId,
                             experience
                           }) => {

  const [isHidden, setIsHidden] = useState(true);
  const showMore = () => setIsHidden(false);
  const showLess = () => setIsHidden(true);
  const classes = useStyles();
  const {company, title, location, current, to, from, description} = experience;

  if (!description || description.length <= DESCRIPTION_LIMIT) {
    return (
      <Grid container justify="space-between">
        <CardContent className={classes.root}>
          <Box fontWeight={700}>
            <Typography variant="body1" className={classes.boldTypography}>{title}</Typography>
          </Box>
          <Typography variant="body2">{company}</Typography>
          <Typography variant="body2"
                      color="textSecondary">{format(from)} - {current ? "Present" : format(to)}</Typography>
          <Typography variant="body2" color="textSecondary">{location}</Typography>
          <Typography variant="body2" component="p">{description}</Typography>
        </CardContent>
        <Grid item>
          {
            user === userId &&
            <IconModal icon={<BiPencil size={30} />} content={<EditExperience experience={experience} />} />
          }
        </Grid>
      </Grid>
    );
  } else if (isHidden) {
    const content = description.substring(0, DESCRIPTION_LIMIT) + "...";
    return (
      <Grid container justify="space-between">
        <CardContent className={classes.root}>
          <Box fontWeight={700}>
            <Typography variant="body1" className={classes.boldTypography}>{title}</Typography>
          </Box>
          <Typography variant="body2">{company}</Typography>
          <Typography variant="body2"
                      color="textSecondary">{format(from)} - {current ? "Present" : format(to)}</Typography>
          <Typography variant="body2" color="textSecondary">{location}</Typography>
          <Typography variant="body2" component="p">
            {content} <Link onClick={showMore} className={classes.cursorToPointer}>see more</Link>
          </Typography>
        </CardContent>
        <Grid item>
          <IconModal icon={<BiPencil size={30} />} content={<EditExperience experience={experience} />} />
        </Grid>
      </Grid>
    );
  } else {
    return (
      <>
        <Grid container justify="space-between">
          <CardContent className={classes.root}>
            <Box fontWeight={700}>
              <Typography variant="body1" className={classes.boldTypography}>{title}</Typography>
            </Box>
            <Typography variant="body2">{company}</Typography>
            <Typography variant="body2"
                        color="textSecondary">{format(from)} - {current ? "Present" : format(to)}</Typography>
            <Typography variant="body2" color="textSecondary">{location}</Typography>
            <Typography variant="body2" component="p">{description}</Typography>
          </CardContent>
          <Grid item>
            <IconModal icon={<BiPencil size={30} />} content={<EditExperience experience={experience} />} />
          </Grid>
        </Grid>
        <CardContent className={classes.reduceTopMargin}>
          <Link onClick={showLess} className={classes.cursorToPointer}>see less</Link>
        </CardContent>
      </>
    );
  }
};

ProfileExperience.propTypes = {
  user: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  experience: PropTypes.object.isRequired
};

export default ProfileExperience;
