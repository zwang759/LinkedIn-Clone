import React, {useState} from "react";
import PropTypes from "prop-types";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import {IconButton} from "@material-ui/core";
import {AiOutlineClose} from "react-icons/ai";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CommentForm from "../commentForm/CommentForm";
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

const UploadPhoto = ({postId, commentTo, user, avatar, name, savedText, replyToId, replyToName, handleClose}) => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [toCommentForm, setToCommentForm] = useState(false);

  React.useEffect(() => {
    if (!selectedFile) {
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSubmit = () => {
    setToCommentForm(true);
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
      {toCommentForm ?
        React.cloneElement(
          <CommentForm
            postId={postId}
            commentTo={commentTo}
            user={user}
            avatar={avatar}
            name={name}
            savedText={savedText}
            preview={preview}
            file={selectedFile}
            type="photo"
            replyToId={replyToId}
            replyToName={replyToName}
          />,
          {handleClose: handleClose}) :
        <>
          <DialogTitle>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                Select your photo
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
                Select an image to share
                <input
                  type="file"
                  accept="image/*"
                  onChange={onChange}
                  style={{display: "none"}}
                />
              </Button> :
              <Grid container justify="center">
                <img className={classes.media} src={preview} alt="" />
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

UploadPhoto.propTypes = {
  user: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  replyToId: PropTypes.string,
  replyToName: PropTypes.string
};

export default UploadPhoto;