import React from "react";
import Panel from "../../layout/panel";
import moment from "moment";
import {FaRegThumbsUp} from "react-icons/fa";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {addCommentLike, deleteComment, removeCommentLike} from "../../../redux/actions/post";
import {
  Avatar,
  Column,
  CommentIcon,
  Container,
  FilledLikeIcon,
  OutlineLikeIcon,
  PostDocument,
  PostImage,
  PostVideo,
  Row,
  SendIcon,
  Separator,
  ShareIcon,
  StyledLink
} from "./styles";
import {addView} from "../../../redux/actions/profile";
import CommentButtonModal from "../../layout/buttonModal/CommentButtonModal";
import {makeStyles} from "@material-ui/core/styles";
import CommentForm from "../commentForm/CommentForm";
import Grid from "@material-ui/core/Grid";
import {IconButton} from "@material-ui/core";
import {DeleteIcon, MoreIcon} from "../postItem/styles";
import Popper from "@material-ui/core/Popper";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles({
  center: {
    display: "flex",
    alignItems: "center"
  }
});

const CommentItem = ({
                       postId,
                       profile,
                       comment: {_id, text, src, user, name, avatar, status, replyToName, replyToId, likes, createdAt},
                       addView,
                       addCommentLike,
                       removeCommentLike,
                       deleteComment
                     }) => {

  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };


  const onClickAvatar = () => {
    addView({"user": user});
  };

  return (
    <Panel>
      <Container>
        <Grid container justify="space-between">
          <Grid item>
            <Row className="heading">
              <StyledLink to={`/profile/${user}`} onClick={onClickAvatar}>
                <Avatar src={avatar} alt="" />
              </StyledLink>
              <Column>
                <h3>{name}</h3>
                <h4>{status}</h4>
                <time> {moment(createdAt).fromNow()} </time>
              </Column>
            </Row>
          </Grid>
          <Grid item>
            <IconButton
              ref={anchorRef}
              aria-controls={open ? "menu-list-grow" : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
            >
              <MoreIcon />
            </IconButton>
            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition
                    disablePortal>
              {({TransitionProps, placement}) => (
                <Grow
                  {...TransitionProps}
                  style={{transformOrigin: placement === "bottom" ? "center top" : "center bottom"}}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList autoFocusItem={open}>
                        {profile.user === user &&
                        <MenuItem onClick={() => deleteComment(postId, _id)}><DeleteIcon />Delete this
                          post</MenuItem>}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Grid>
        </Grid>
        <Row className="content">
          <p style={{whiteSpace: "break-spaces"}}>
            {replyToName &&
            <StyledLink
              to={`/profile/${replyToId}`}
              style={{textDecoration: "none"}}
            >
              @{replyToName}
            </StyledLink>}
            {" " + text}
          </p>
        </Row>
        {src && src.type === "photo" && <PostImage
          src={src.url}
          alt=""
        />}
        {src && src.type === "video" && <PostVideo
          controls
        >
          <source src={src.url} type="video/mp4" />
          <source src={src.url} type="video/ogg" />
          <source src={src.url} type="video/webm" />
          Your browser does not support the video tag.
        </PostVideo>}
        {src && src.type === "document" && <PostDocument
          title="post-document"
          src={`https://drive.google.com/viewerng/viewer?embedded=true&url=${src.url}`}
          width="100%"
          height="100%"
          frameBorder='0'
        />}

        <Row className="likes">
          <FaRegThumbsUp className="thumbsUp" />
          <span className="number"> {likes.length} </span>
        </Row>

        <Row>
          <Separator />
        </Row>

        <Row className="actions">
          {likes.some(like => like === profile.user) ?
            <button
              onClick={(e) => {
                removeCommentLike(_id);
              }}>
              <div className={classes.center}>
                <FilledLikeIcon color="var(--color-link)" />
                <span>Like</span>
              </div>
            </button> :
            <button
              onClick={(e) => {
                addCommentLike(_id);
              }}>
              <div className={classes.center}>
                <OutlineLikeIcon />
                <span>Like</span>
              </div>
            </button>}
          <CommentButtonModal
            fullWidth={false}
            icon={
              <div className={classes.center}>
                <CommentIcon />
                <span>Reply</span>
              </div>
            }
            content={
              <CommentForm
                postId={postId}
                user={profile.user}
                avatar={profile.avatar}
                name={profile.name}
                replyToName={name}
                replyToId={user}
              />
            }
          />
          <button>
            <div className={classes.center}>
              <ShareIcon />
              <span>Share</span>
            </div>
          </button>
          <button>
            <div className={classes.center}>
              <SendIcon />
              <span>Send</span>
            </div>
          </button>
        </Row>
      </Container>
    </Panel>
  );
};

CommentItem.propTypes = {
  postId: PropTypes.string.isRequired,
  addView: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  addCommentLike: PropTypes.func.isRequired,
  removeCommentLike: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  postId: state.comment.post._id
});

export default connect(
  mapStateToProps,
  {addView, addCommentLike, removeCommentLike, deleteComment}
)(CommentItem);


