import React, {useState} from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import {connect} from "react-redux";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import {updateGithubusername} from "../../redux/actions/profile";
import {IconButton} from "@material-ui/core";
import {AiOutlineClose} from "react-icons/ai";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  root: {
    textTransform: "none"
  }
});

const EditGitHub = ({handleClose, githubusername, updateGithubusername}) => {
  const classes = useStyles();

  const initialState = {"githubusername": githubusername};

  const [formData, setFormData] = useState(initialState);

  const onChange = e => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const onSubmit = () => {
    updateGithubusername(formData);
    handleClose();
  };

  return (
    <>
      <DialogTitle>
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            Edit GitHub username
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
          label="GitHub username"
          name="githubusername"
          placeholder="Your GitHub username..."
          value={formData.githubusername}
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


EditGitHub.propTypes = {
  githubusername: PropTypes.string,
  updateGithubusername: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default connect(null, {updateGithubusername})(EditGitHub);