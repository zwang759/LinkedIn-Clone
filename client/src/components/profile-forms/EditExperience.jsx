import React, {useState} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {deleteExperience, editExperience} from "../../redux/actions/profile";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
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

const EditExperience = ({
                          experience: {_id, company, title, location, current, to, from, description},
                          editExperience,
                          deleteExperience,
                          handleClose
                        }) => {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    company: company,
    title: title,
    location: location,
    from: from,
    to: to,
    current: current,
    description: description ? description : ""
  });

  const onChange = e => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const onSubmit = () => {
    editExperience(_id, formData);
    handleClose();
  };

  return (
    <>
      <DialogTitle>
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            Edit experience
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
            value={formData.title}
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
            value={formData.company}
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
            value={formData.location}
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
            value={formData.from}
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
                checked={formData.current}
                value={formData.current}
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
            value={formData.description}
            onChange={onChange}
            onKeyDown={e => e.stopPropagation()}
            fullWidth
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Grid container justify="space-between">
          <Button variant="outlined" className={classes.root} onClick={() => deleteExperience(_id)}> Delete </Button>
          <Button variant="contained" color="primary" className={classes.root} onClick={onSubmit}> Save </Button>
        </Grid>
      </DialogActions>
    </>
  );
};

EditExperience.propTypes = {
  editExperience: PropTypes.func.isRequired,
  deleteExperience: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  experience: PropTypes.object.isRequired
};

export default connect(null, {editExperience, deleteExperience})(EditExperience);
