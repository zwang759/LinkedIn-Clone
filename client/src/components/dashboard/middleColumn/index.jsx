import React from "react";
import LoadingFeedPost from "../shimmer/LoadingFeedPost";
import FeedShare from "./FeedShare";
import FeedPost from "./FeedPost";
import {Container} from "./styles";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getMorePostsByPostIds, getPostIdsOfFollowing, getPostsByPostIds} from "../../../redux/actions/post";
import useInfiniteScroll from "../../infinite-scroll/InfiniteScroll";
import Spinner from "../../layout/spinner";

const MiddleColumn = ({
                        profile: {profile},
                        post: {postIds, posts, index, loadingPostIds, loading, isLastPage},
                        getPostIdsOfFollowing,
                        getPostsByPostIds,
                        getMorePostsByPostIds
                      }) => {


  React.useEffect(() => {
    if (!index) {
      getPostIdsOfFollowing(profile.following, profile.user);
    }
  }, [index]);

  const fetchMoreListItems = () => {
    if (!isLastPage && !loading) {
      getMorePostsByPostIds(postIds, index);
    }
    setIsFetching(false);
  };

  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);

  React.useEffect(() => {
    // if it is still loading postIds or previously we loaded some posts, do nothing
    if (loadingPostIds || index) {
      return;
    }
    getPostsByPostIds(postIds);
  }, [loadingPostIds]);

  return (
    <>
      {loadingPostIds ? <Spinner /> :
        <Container className="middle-column">
          <FeedShare user={profile.user} avatar={profile.avatar} name={profile.name} />
          {loading ? postIds.slice(0, 10).map(postId => <LoadingFeedPost key={postId} />)
            :
            posts.map((post) => (
              <FeedPost
                key={post._id}
                profile={profile}
                post={post}
              />
            ))}
          {isFetching && !isLastPage && <LoadingFeedPost />}
        </Container>}
    </>
  );
};

MiddleColumn.propTypes = {
  getPostIdsOfFollowing: PropTypes.func.isRequired,
  getPostsByPostIds: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  post: state.post,
  profile: state.profile
});

export default connect(mapStateToProps, {
  getPostIdsOfFollowing,
  getPostsByPostIds,
  getMorePostsByPostIds
})(MiddleColumn);
