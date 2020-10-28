import React, {useState} from "react";
import PropTypes from "prop-types";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import {IconButton} from "@material-ui/core";
import {AiOutlineClose} from "react-icons/ai";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import PostForm from "./PostForm";
import DialogContent from "@material-ui/core/DialogContent";


const useStyles = makeStyles({
  root: {
    textTransform: "none",
    margin: "0 10px"
  },
  media: {
    maxWidth: "600px"
  }
});

const UploadVideo = ({user, avatar, name, savedText, handleClose}) => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [toPostForm, setToPostForm] = useState(false);

  React.useEffect(() => {
    if (!selectedFile) {
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSubmit = () => {
    setToPostForm(true);
  };

  const onChange = (e) => {
    if (e.target.files && e.target.files.length !== 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    URL.revokeObjectURL(preview);
    setPreview(null);
  };

  return (
    <>
      {toPostForm ?
        React.cloneElement(
          <PostForm user={user} avatar={avatar} name={name} savedText={savedText} preview={preview} file={selectedFile}
                    type="video" />,
          {handleClose: handleClose}) :
        <>
          <DialogTitle>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                Edit photo
              </Grid>
              <Grid item>
                <IconButton onClick={() => {
                  if (preview) {
                    removeFile();
                  }
                  handleClose();
                }}>
                  <AiOutlineClose />
                </IconButton>
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent dividers>
            {!selectedFile ?
              <Button component="label" color="primary" className={classes.root} fullWidth>
                Select a video to share
                <input
                  type="file"
                  accept="video/mp4,video/ogg,video/webm"
                  onChange={onChange}
                  style={{display: "none"}}
                />
              </Button> :
              <Grid container justify="center">
                <video
                  className={classes.media}
                  controls
                >
                  <source src={preview} type="video/mp4" />
                  <source src={preview} type="video/ogg" />
                  <source src={preview} type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              </Grid>
            }
          </DialogContent>
          <DialogActions>
            <Grid container justify="flex-end" alignItems="center">
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={() => {
                    if (preview) {
                      removeFile();
                    }
                    handleClose();
                  }}
                  className={classes.root}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onSubmit}
                  className={classes.root}
                  disabled={selectedFile === null}
                >
                  Done
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </>}
    </>
  );
};

UploadVideo.propTypes = {
  user: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default UploadVideo;