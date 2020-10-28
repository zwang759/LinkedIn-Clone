import React, {useState} from "react";
import PropTypes from "prop-types";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {BiChevronDown, BiChevronUp, BiPencil} from "react-icons/bi";
import CardActionArea from "@material-ui/core/CardActionArea";
import IconModal from "../layout/iconModal/IconModal";
import UpdateSkills from "../profile-forms/UpdateSkills";
import {SKILLS_LIMIT} from "../../enum/enum";

const useStyles = makeStyles({
  root: {
    padding: 10
  },
  center: {
    justifyContent: "center"
  },
  cardContent: {
    padding: "0px 16px",
    "&:first-child": {
      paddingTop: 16
    },
    "&:last-child": {
      paddingBottom: 24
    }
  },
  addANewSkill: {
    color: "#757575",
    textTransform: "none",
    fontSize: 18,
    "&:hover": {
      backgroundColor: "#eeeeee"
    }
  },
  wrapIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});

const ProfileSkills = ({
                         user,
                         userId,
                         skills
                       }) => {
  const classes = useStyles();
  const [isHidden, setIsHidden] = useState(true);
  const showMore = () => setIsHidden(false);
  const showLess = () => setIsHidden(true);

  const title = (
    <Grid container justify="space-between" alignItems="center">
      <CardContent>
        <Typography variant="h5">Skills</Typography>
      </CardContent>
      <Grid item>
        {user === userId &&
        <>
          <Button className={classes.addANewSkill}> Add a new skill </Button>
          <IconModal icon={<BiPencil size={30} />} content={<UpdateSkills skills={skills} />} />
        </>
        }
      </Grid>
    </Grid>
  );

  const skillsInfo = (skills) => {
    return (
      <Card className={classes.root}>
        {title}
        <Grid container spacing={0}>
          {skills.map((skill, index) => (
            <Grid item xs={6} key={index}>
              <h4 className={classes.cardContent}>{skill}</h4>
            </Grid>
          ))}
        </Grid>
      </Card>
    );
  };

  if (skills && skills.length <= SKILLS_LIMIT) {
    return skillsInfo(skills);
  } else if (isHidden) {
    const content = skills.slice(0, SKILLS_LIMIT);
    return (
      <>
        {skillsInfo(content)}
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
        {skillsInfo(skills)}
        <Card variant="outlined">
          <CardActions className={classes.center}>
            <CardActionArea onClick={showLess}>
              <Typography variant="h6" color="primary" className={classes.wrapIcon}>Show
                less<BiChevronUp /></Typography>
            </CardActionArea>
          </CardActions>
        </Card>
      </>
    );
  }
};

ProfileSkills.propTypes = {
  user: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  skills: PropTypes.array.isRequired
};

export default ProfileSkills;