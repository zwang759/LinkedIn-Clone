import React, {useState} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {addExperience} from "../../redux/actions/profile";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import DialogActions from "@material-ui/core/DialogActions";
import DateFnsUtils from "@date-io/date-fns";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
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

const AddExperience = ({addExperience, handleClose}) => {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    company: "",
    title: "",
    location: "",
    from: null,
    to: null,
    current: false,
    description: ""
  });

  const {company, title, location, from, to, current, description} = formData;

  const onChange = e => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const onSubmit = () => {
    addExperience(formData);
    handleClose();
  };

  return (
    <>
      <DialogTitle>
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            Add experience
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
            label="Job Title"
            name="title"
            value={title}
            onChange={onChange}
            placeholder="Job Title"
            onKeyDown={e => e.stopPropagation()}
            required
            fullWidth
          />
        </div>

        <div>
          <TextField
            type="text"
            label="Company"
            name="company"
            placeholder="Company Name"
            value={company}
            onChange={onChange}
            onKeyDown={e => e.stopPropagation()}
            required
            fullWidth
          />
        </div>

        <div>
          <TextField
            type="text"
            label="Location"
            name="location"
            value={location}
            onChange={onChange}
            placeholder="Location of your workplace"
            onKeyDown={e => e.stopPropagation()}
            required
            fullWidth
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
            value={formData.to}
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
            onKeyDown={e => e.stopPropagation()}
            fullWidth
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

AddExperience.propTypes = {
  addExperience: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default connect(
  null,
  {addExperience}
)(AddExperience);
