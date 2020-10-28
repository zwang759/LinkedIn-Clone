import React, {useState} from "react";
import PropTypes from "prop-types";
import {updateIntro} from "../../redux/actions/profile";
import {connect} from "react-redux";
import TextField from "@material-ui/core/TextField";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Grid from "@material-ui/core/Grid";
import {AiOutlineClose} from "react-icons/ai";
import {IconButton} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  root: {
    textTransform: "none"
  }
});

const EditIntro = ({handleClose, location, status, updateIntro}) => {
  const classes = useStyles();

  const initialState = {"status": status, "location": location};

  const [formData, setFormData] = useState(initialState);

  const onChange = e => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const onSubmit = () => {
    updateIntro(formData);
    handleClose();
  };


  return (
    <>
      <DialogTitle>
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            Edit intro
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
          label="Status"
          name="status"
          placeholder="Your current status that shows on your profile..."
          value={formData.status}
          onChange={onChange}
          onKeyDown={e => e.stopPropagation()}
          fullWidth
          required
        />
        <TextField
          type="text"
          label="Location"
          name="location"
          placeholder="Your current location [city, state, country]..."
          value={formData.location}
          onChange={onChange}
          onKeyDown={e => e.stopPropagation()}
          fullWidth
          required
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


EditIntro.propTypes = {
  status: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  updateIntro: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default connect(null, {updateIntro})(EditIntro);