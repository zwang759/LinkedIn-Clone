import React, {useState} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {addComment, addCommentAndUploadMedia} from "../../../redux/actions/post";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import {CameraIcon, DocumentIcon, VideoCameraIcon} from "../../dashboard/middleColumn/FeedShare/styles";
import {IconButton, Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {AiFillCloseCircle, AiOutlineClose} from "react-icons/ai";
import DialogActions from "@material-ui/core/DialogActions";
import UploadPhoto from "../uploadPhoto/UploadPhoto";
import UploadVideo from "../uploadVideo/UploadVideo";
import UploadDocument from "../uploadDocument/UploadDocument";
import {deleteFile} from "../../../redux/utils/aws-s3";
import {useLocation} from "react-router";

const useStyles = makeStyles({
  avatar: {
    width: "48px",
    height: "48px",
    marginTop: "0px",
    marginRight: "8px"
  },
  root: {
    textTransform: "none"
  },
  media: {
    width: "550px"
  }
});

const CommentForm = ({
                       postId,
                       user,
                       avatar,
                       name,
                       commentTo,
                       replyToId,
                       replyToName,
                       savedText,
                       file,
                       preview,
                       type,
                       addComment,
                       addCommentAndUploadMedia,
                       handleClose
                     }) => {
  const classes = useStyles();
  const [text, setText] = useState(savedText ? savedText : "");
  const [form, setForm] = useState("comment");
  const location = useLocation();

  const onSubmit = () => {
    const trimmed = text.trim();
    if (trimmed.length < 700) {
      if (type && (type === "photo" || type === "video")) {
        addCommentAndUploadMedia(
          postId,
          {
            "text": trimmed,
            "replyToId": replyToId ? replyToId : null,
            "replyToName": replyToName ? replyToName : null,
            "file": file,
            "type": type
          },
          location.pathname);
      } else {
        addComment(
          postId,
          {
            "text": trimmed,
            "replyToId": replyToId ? replyToId : null,
            "replyToName": replyToName ? replyToName : null,
            "src": preview ? {"url": preview, "type": type} : ""
          },
          location.pathname);
      }
    }
    handleClose();
  };

  const cancel = async () => {
    if (type === "document") {
      await deleteFile(file);
    }
    handleClose();
  };

  const onChange = (e) => {
    setText(e.target.value);
  };

  const changeFormToPhoto = (e) => {
    e.preventDefault();
    setForm("photo");
  };

  const changeFormToVideo = (e) => {
    e.preventDefault();
    setForm("video");
  };

  const changeFormToDocument = (e) => {
    e.preventDefault();
    setForm("document");
  };

  const render = () => {
    switch (form) {
      case "photo":
        return (
          React.cloneElement(
            <UploadPhoto
              postId={postId}
              user={user}
              avatar={avatar}
              name={name}
              savedText={text}
              replyToId={replyToId}
              replyToName={replyToName}
            />, {handleClose: handleClose})
        );
      case "video":
        return (
          React.cloneElement(
            <UploadVideo
              postId={postId}
              user={user}
              avatar={avatar}
              name={name}
              savedText={text}
              replyToId={replyToId}
              replyToName={replyToName}
            />, {handleClose: handleClose})
        );
      case "document":
        return (
          React.cloneElement(
            <UploadDocument
              postId={postId}
              user={user}
              avatar={avatar}
              name={name}
              savedText={text}
              replyToId={replyToId}
              replyToName={replyToName}
            />, {handleClose: handleClose})
        );
      default:
        return <>
          <DialogTitle>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                {replyToName ? `Reply to ${replyToName}'s post` : `Comment to ${commentTo}'s post`}
              </Grid>
              <Grid item>
                <IconButton onClick={cancel}>
                  <AiOutlineClose />
                </IconButton>
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container direction="column" justify="space-evenly">
              <Grid item>
                <Grid container justify="flex-start" alignItems="center">
                  <Avatar className={classes.avatar} src={avatar} alt='' />
                  <h4>{name}</h4>
                </Grid>
              </Grid>

              <Grid item>
                <TextField
                  autoFocus
                  type="text"
                  name="text"
                  placeholder="What do you want to talk about?"
                  multiline
                  rows={4}
                  rowsMax={8}
                  value={text}
                  onChange={onChange}
                  onKeyDown={e => e.stopPropagation()}
                  fullWidth
                  InputProps={{disableUnderline: true}}
                />
              </Grid>

              {text.length > 700 && <Grid item>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item>
                    <Typography color="secondary" component="span">
                      <Grid container alignItems="center">
                        <AiFillCloseCircle />
                        You have exceeded the maximum character limit
                      </Grid>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="secondary" component="span">
                      {700 - text.trim().length}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>}

              {preview && type === "photo" &&
              <img className={classes.media} src={preview} alt='' />}
              {preview && type === "video" &&
              <video
                className={classes.media}
                controls
              >
                <source src={preview} type="video/mp4" />
                <source src={preview} type="video/ogg" />
                <source src={preview} type="video/webm" />
                Your browser does not support the video tag.
              </video>}
              {preview && type === "document" &&
              <iframe
                title={file}
                src={`https://drive.google.com/viewerng/viewer?embedded=true&url=${preview}`}
                width="100%"
                height="100%"
                frameBorder='0'
              />}

            </Grid>
          </DialogContent>

          <DialogActions>
            <Grid container justify="space-between" alignItems="center">

              <Grid item>
                <Button
                  color="inherit"
                  className={classes.root}
                  onClick={changeFormToPhoto}
                  disabled={preview === undefined ? false : !!preview}
                >
                  <CameraIcon />
                  Photo
                </Button>
                <Button
                  color="inherit"
                  className={classes.root}
                  onClick={changeFormToVideo}
                  disabled={preview === undefined ? false : !!preview}
                >
                  <VideoCameraIcon />
                  Video
                </Button>
                <Button
                  color="inherit"
                  className={classes.root}
                  onClick={changeFormToDocument}
                  disabled={preview === undefined ? false : !!preview}
                >
                  <DocumentIcon />
                  Document
                </Button>
              </Grid>

              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onSubmit}
                  disabled={(text.length === 0 || text.length > 700) && !preview}
                  className={classes.root}
                >
                  Post
                </Button>
              </Grid>

            </Grid>
          </DialogActions>
        </>;
    }
  };
  return render();
};

CommentForm.propTypes = {
  user: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  savedText: PropTypes.string,
  file: PropTypes.object,
  preview: PropTypes.string,
  type: PropTypes.string,
  replyToId: PropTypes.string,
  replyToName: PropTypes.string,
  addComment: PropTypes.func,
  addCommentAndUploadMedia: PropTypes.func
};

export default connect(null, {addComment, addCommentAndUploadMedia})(CommentForm);
