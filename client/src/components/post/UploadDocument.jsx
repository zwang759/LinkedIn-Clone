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
import {deleteFile, uploadFile} from "../../redux/utils/aws-s3";

const useStyles = makeStyles({
  root: {
    textTransform: "none",
    margin: "0 10px"
  },
  media: {
    maxWidth: "600px"
  }
});

const UploadDocument = ({user, avatar, name, savedText, handleClose}) => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [toPostForm, setToPostForm] = useState(false);

  const onSubmit = () => {
    setToPostForm(true);
  };

  const onChange = async (e) => {
    if (e.target.files && e.target.files.length !== 0) {
      const file = e.target.files[0];
      const [filename, fileLocation] = await uploadFile(file);
      setSelectedFile(filename);
      setPreview(fileLocation);
    }
  };

  const removeFile = async () => {
    await deleteFile(selectedFile);
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <>
      {toPostForm ?
        React.cloneElement(
          <PostForm user={user} avatar={avatar} name={name} savedText={savedText} preview={preview} type="document" />,
          {handleClose: handleClose}) :
        <>
          <DialogTitle>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                Share a document
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
            {(!preview || preview.length === 0) ?
              <Button component="label" color="primary" className={classes.root} fullWidth>
                Select a document to share
                <input
                  type="file"
                  accept=".xlsx,.xls,.doc,.docx,.ppt,.pptx,.txt,.pdf"
                  onChange={onChange}
                  style={{display: "none"}}
                />
              </Button> :
              <Grid container justify="center">
                <iframe
                  title={selectedFile}
                  src={`https://drive.google.com/viewerng/viewer?embedded=true&url=${preview}`}
                  width="100%"
                  height="100%"
                  frameBorder='0'
                />
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

UploadDocument.propTypes = {
  user: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default UploadDocument;