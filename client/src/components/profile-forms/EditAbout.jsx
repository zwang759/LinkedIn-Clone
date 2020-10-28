import React, {useState} from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import {updateAbout} from "../../redux/actions/profile";
import {connect} from "react-redux";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
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

const EditAbout = ({handleClose, about, updateAbout}) => {
  const classes = useStyles();

  const initialState = {"about": about};

  const [formData, setFormData] = useState(initialState);

  const onChange = e => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const onSubmit = () => {
    updateAbout(formData);
    handleClose();
  };

  return (
    <>
      <DialogTitle>
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            Edit About
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
          label="About"
          name="about"
          placeholder="A short summary of yourself..."
          multiline
          rowsMax={8}
          value={formData.about}
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


EditAbout.propTypes = {
  about: PropTypes.string,
  updateAbout: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default connect(null, {updateAbout})(EditAbout);