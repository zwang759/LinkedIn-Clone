import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Container, Panel} from "./styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {useHistory, useLocation} from "react-router-dom";
import useInfiniteScroll from "../../infinite-scroll/InfiniteScroll";
import {clearPosts, getMorePostsByPostIds, getPostIdsBySearch, getPostsByPostIds} from "../../../redux/actions/post";
import FeedPost from "../../dashboard/middleColumn/FeedPost";
import LoadingFeedPost from "../../dashboard/shimmer/LoadingFeedPost";
import {getCurrentProfile} from "../../../redux/actions/profile";
import Spinner from "../../layout/spinner";

const Content = ({
                   getCurrentProfile,
                   getPostIdsBySearch,
                   getPostsByPostIds,
                   getMorePostsByPostIds,
                   clearPosts,
                   profile: {profile, loadingProfile},
                   post: {
                     postIds,
                     posts,
                     index,
                     loadingPostIds,
                     loading,
                     isLastPage
                   }
                 }) => {

  const location = useLocation();
  const history = useHistory();
  const [searchIn, setSearchIn] = React.useState("Content");

  React.useLayoutEffect(() => {
    if (index) clearPosts();
    if (!profile) {
      getCurrentProfile();
    }
    return () => {
      clearPosts();
    };
  }, []);

  React.useEffect(() => {
    getPostIdsBySearch(location.search.slice(10));
  }, [location]);

  React.useEffect(() => {
    if (loadingPostIds) {
      return;
    }
    getPostsByPostIds(postIds);
  }, [postIds]);


  const fetchMoreListItems = () => {
    if (!isLastPage && !loading) {
      getMorePostsByPostIds(postIds, index);
    }
    setIsFetching(false);
  };

  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);


  const handleChange = (e) => {
    setSearchIn(e.target.value);
  };

  React.useEffect(() => {
    if (searchIn === "People") {
      history.push(`/search/results/people/?keywords=${location.search.slice(10)}`);
    }
  }, [searchIn]);

  return (
    <>
      {loadingProfile ? <Spinner /> : <>
        <Panel className="filter-Panel">
          <FormControl variant="filled" size="small" style={{marginLeft: "62px"}}>
            <InputLabel>In</InputLabel>
            <Select
              value={searchIn}
              onChange={handleChange}
            >
              <MenuItem value="People">People</MenuItem>
              <MenuItem value="Content">Content</MenuItem>
            </Select>
          </FormControl>
        </Panel>

        <Container className="middle-column">
          {posts.map((post) => (
            <FeedPost
              key={post._id}
              profile={profile}
              post={post}
              loadingPostIds={loadingPostIds}
              loading={loading}
            />
          ))}
          {isFetching && !isLastPage && <LoadingFeedPost />}
        </Container>
      </>
      }
    </>
  );
};

Content.propTypes = {
  getPostIdsBySearch: PropTypes.func.isRequired,
  getPostsByPostIds: PropTypes.func.isRequired,
  getMorePostsByPostIds: PropTypes.func.isRequired,
  clearPosts: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  post: state.post
});

export default connect(
  mapStateToProps,
  {
    getCurrentProfile,
    getPostIdsBySearch,
    getPostsByPostIds,
    getMorePostsByPostIds,
    clearPosts
  })
(Content);