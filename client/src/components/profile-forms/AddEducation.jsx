import React, {useState} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {addEducation} from "../../redux/actions/profile";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
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

const AddEducation = ({addEducation, handleClose}) => {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    school: "",
    degree: "",
    fieldofstudy: "",
    from: null,
    to: null,
    current: false,
    description: ""
  });

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    description,
    current
  } = formData;

  const onChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const onSubmit = () => {
    addEducation(formData);
    handleClose();
  };

  return (
    <>
      <DialogTitle>
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            Add education
          </Grid>
          <Grid item>
            <IconButton onClick={() => handleClose()}>
              <AiOutlineClose />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent dividers>
        <div>
          <TextField
            type="text"
            label="School"
            name="school"
            value={school}
            onChange={onChange}
            placeholder="School or Bootcamp"
            onKeyDown={e => e.stopPropagation()}
            fullWidth
            required
          />
        </div>

        <div>
          <TextField
            type="text"
            label="Degree"
            name="degree"
            placeholder="* Degree or Certificate"
            value={degree}
            onChange={onChange}
            onKeyDown={e => e.stopPropagation()}
            fullWidth
            required
          />
        </div>

        <div>
          <TextField
            type="text"
            label="Field of Study"
            name="fieldofstudy"
            value={fieldofstudy}
            onChange={onChange}
            placeholder="Field of Study"
            onKeyDown={e => e.stopPropagation()}
            fullWidth
            required
          />
        </div>

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            views={["year", "month"]}
            disableToolbar
            variant="inline"
            format="MMMM, yyyy"
            margin="normal"
            label="From"
            name="from"
            value={from}
            onChange={(date) => setFormData({...formData, from: date})}
            fullWidth
          />
        </MuiPickersUtilsProvider>

        <div>
          <FormControlLabel
            control={
              <Checkbox
                name="current"
                color="primary"
                checked={current}
                value={current}
                onChange={() =>
                  setFormData({...formData, current: !formData.current})
                }
                onKeyDown={e => e.stopPropagation()}
              />
            }
            label="Current"
          />
        </div>


        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            views={["year", "month"]}
            disableToolbar
            variant="inline"
            format="MMMM, yyyy"
            margin="normal"
            label="To"
            name="to"
            value={to}
            onChange={(date) => setFormData({...formData, to: date})}
            disabled={formData.current}
            fullWidth
          />
        </MuiPickersUtilsProvider>

        <div>
          <TextField
            type="text"
            label="Description"
            name="description"
            placeholder="A description of your experience..."
            multiline
            rowsMax={8}
            value={description}
            onChange={onChange}
            fullWidth
            onKeyDown={e => e.stopPropagation()}
          />
        </div>
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

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default connect(null, {addEducation})(AddEducation);
