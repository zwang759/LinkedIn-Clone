import React, {useEffect} from "react";
import {Container} from "./styles";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {clearComments, getCommentIds, getComments, getMoreComments, getPost} from "../../redux/actions/post";
import useInfiniteScroll from "../infinite-scroll/InfiniteScroll";
import CommentItem from "./commentItem/CommentItem";
import {getCurrentProfile} from "../../redux/actions/profile";
import PostItem from "./postItem/PostItem";
import LoadingPostItem from "./loadingPostItem/LoadingPostItem";
import Spinner from "../layout/spinner";
import LoadingFeedPost from "../dashboard/shimmer/LoadingFeedPost";

const Comments = ({
                    profile: {profile, loadingProfile},
                    match,
                    comment: {
                      loadingCommentIds,
                      commentIds,
                      loadingComments,
                      index,
                      comments,
                      post,
                      loadingPost,
                      isLastPage
                    },
                    getCurrentProfile,
                    getPost,
                    getCommentIds,
                    getComments,
                    getMoreComments,
                    clearComments
                  }) => {

  useEffect(() => {
    getCurrentProfile();
    getPost(match.params.id);
    getCommentIds(match.params.id);
    return () => clearComments();
  }, []);

  const fetchMoreListItems = () => {
    if (!isLastPage && !loadingComments) {
      getMoreComments(commentIds, index);
    }
    setIsFetching(false);
  };

  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);

  useEffect(() => {
    if (loadingCommentIds) {
      return;
    }
    getComments(commentIds);
  }, [loadingCommentIds]);

  return (
    <>
      {loadingProfile ? <Spinner /> :
        <Container>
          {(loadingPost || loadingProfile) ? <LoadingPostItem /> :
            <>
              <PostItem
                profile={profile}
                post={post}
              />
              {loadingCommentIds &&
              loadingComments ?
                commentIds.slice(0, 10).map(commentId => <LoadingFeedPost key={commentId} />) :
                comments.map((comment) => (
                  <CommentItem
                    key={comment._id}
                    postId={post._id}
                    profile={profile}
                    comment={comment}
                  />
                ))}
            </>
          }
          {isFetching && !isLastPage && <LoadingPostItem />}
        </Container>}
    </>
  );
};

Comments.propTypes = {
  profile: PropTypes.object.isRequired,
  comment: PropTypes.object.isRequired,
  getCommentIds: PropTypes.func.isRequired,
  getComments: PropTypes.func.isRequired,
  getMoreComments: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  comment: state.comment
});

export default connect(mapStateToProps, {
  getCurrentProfile,
  getPost,
  getCommentIds,
  getComments,
  getMoreComments,
  clearComments
})(Comments);
