import React, {useState} from "react";
import PropTypes from "prop-types";
import {updateSkills} from "../../redux/actions/profile";
import {connect} from "react-redux";
import TextField from "@material-ui/core/TextField";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Grid from "@material-ui/core/Grid";
import {IconButton} from "@material-ui/core";
import {AiOutlineClose} from "react-icons/ai";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  root: {
    textTransform: "none"
  }
});

const UpdateSkills = ({handleClose, skills, updateSkills}) => {
  const classes = useStyles();

  const initialState = {"skills": skills.join()};

  const [formData, setFormData] = useState(initialState);

  const onChange = e => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const onSubmit = () => {
    updateSkills(formData);
    handleClose();
  };


  return (
    <>
      <DialogTitle>
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            Add skills
          </Grid>
          <Grid item>
            <IconButton onClick={() => handleClose()}>
              <AiOutlineClose />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>

      <DialogContent dividers>
        <TextField
          type="text"
          label="Skills"
          name="skills"
          placeholder="Your current skills that shows on your profile..."
          multiline
          rowsMax={8}
          value={formData.skills}
          onChange={onChange}
          onKeyDown={e => e.stopPropagation()}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Grid container justify="space-between">
          <Button variant="outlined" className={classes.root} onClick={() => handleClose()}> Discard </Button>
          <Button variant="contained" className={classes.root} color="primary" onClick={onSubmit}> Save </Button>
        </Grid>
      </DialogActions>
    </>
  );
};


UpdateSkills.propTypes = {
  skills: PropTypes.array.isRequired,
  updateSkills: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default connect(null, {updateSkills})(UpdateSkills);