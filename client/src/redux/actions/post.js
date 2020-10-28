import {setAlert} from "./alert";
import {
  ADD_COMMENT,
  ADD_POST,
  CLEAR_COMMENTS,
  CLEAR_POSTS,
  COMMENT_ERROR,
  DELETE_COMMENT,
  DELETE_POST,
  GET_COMMENTIDS,
  GET_COMMENTS,
  GET_MORE_COMMENTS,
  GET_MORE_POSTS,
  GET_POST,
  GET_POSTIDS,
  GET_POSTS,
  NO_POSTS_FOUND,
  POST_ERROR,
  SET_COMMENT_LOADING,
  SET_ISLASTPAGE_COMMENT,
  SET_ISLASTPAGE_POST,
  SET_POST_LOADING,
  UPDATE_COMMENTLIKES,
  UPDATE_LIKE_FOR_POST,
  UPDATE_LIKES,
  UPDATE_NUM_OF_COMMENTS
} from "../types/types";
import {PAGE_LIMIT} from "../../enum/enum";
import api from "../utils/api";
import {deleteFile, uploadFile} from "../utils/aws-s3";

// Get posts by search text
export const getPostIdsBySearch = (keywords) => async dispatch => {
  try {
    const res = await api.get(`/api/posts/search/results?keywords=${keywords}`);
    dispatch({
      type: GET_POSTIDS,
      payload: res.data
    });

  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};


// Get all postIds of folllowing (and user itself's postIds)
export const getPostIdsOfFollowing = (followingIds, userId) => async dispatch => {
  try {
    let userIds = {"followingIds": followingIds.map(followingId => followingId.user)};
    userIds.followingIds.push(userId);
    const res = await api.post(`/api/posts/getPostIdsOfFollowing`, userIds, {headers: {"Content-Type": "application/json"}});

    dispatch({
      type: GET_POSTIDS,
      payload: res.data
    });

  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};

// get initial posts by postIds
export const getPostsByPostIds = (postIds) => async dispatch => {
  if (postIds.length === 0) {
    dispatch({type: NO_POSTS_FOUND});
  } else {
    try {
      dispatch({type: SET_POST_LOADING});

      const body = {"postIds": postIds.slice(0, PAGE_LIMIT)};
      const res = await api.post(`/api/posts/getPostsByPostIds`, body, {headers: {"Content-Type": "application/json"}});

      // sort array based on its original order because the cache layer messed up the order
      res.data.sort((x, y) => postIds.indexOf(x._id) - postIds.indexOf(y._id));

      dispatch({
        type: GET_POSTS,
        payload: {posts: res.data, index: res.data.length}
      });
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: {msg: err.response.statusText, status: err.response.status}
      });
    }
  }
};

// get more posts by postIds
export const getMorePostsByPostIds = (postIds, index) => async dispatch => {
  if (postIds.length === index) {
    dispatch({type: SET_ISLASTPAGE_POST});
  } else {
    try {
      dispatch({type: SET_POST_LOADING});
      const body = {"postIds": postIds.slice(index, index + PAGE_LIMIT)};
      const res = await api.post(`/api/posts/getPostsByPostIds`, body, {headers: {"Content-Type": "application/json"}});
      // sort array based on its original order because the cache layer messed up the order
      res.data.sort((x, y) => postIds.indexOf(x._id) - postIds.indexOf(y._id));

      dispatch({
        type: GET_MORE_POSTS,
        payload: {posts: res.data, index: index + res.data.length}
      });
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: {msg: err.response.statusText, status: err.response.status}
      });
    }
  }
};

export const clearPosts = () => async dispatch => {
  dispatch({type: CLEAR_POSTS});
};


// Add like in comment page
export const addLikeForPost = id => async dispatch => {
  try {
    const res = await api.put(`/api/posts/like/${id}`);

    dispatch({
      type: UPDATE_LIKE_FOR_POST,
      payload: {id, likes: res.data}
    });
  } catch (err) {
    dispatch({
      type: COMMENT_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};

// Remove like in comment page
export const removeLikeForPost = id => async dispatch => {
  try {
    const res = await api.put(`/api/posts/unlike/${id}`);

    dispatch({
      type: UPDATE_LIKE_FOR_POST,
      payload: {id, likes: res.data}
    });
  } catch (err) {
    dispatch({
      type: COMMENT_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};


// Add like
export const addLike = id => async dispatch => {
  try {
    const res = await api.put(`/api/posts/like/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: {id, likes: res.data}
    });

  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};

// Remove like
export const removeLike = id => async dispatch => {
  try {
    const res = await api.put(`/api/posts/unlike/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: {id, likes: res.data}
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};

// Add like
export const addCommentLike = id => async dispatch => {
  try {
    const res = await api.put(`/api/posts/comment/like/${id}`);

    dispatch({
      type: UPDATE_COMMENTLIKES,
      payload: {id, likes: res.data}
    });
  } catch (err) {
    dispatch({
      type: COMMENT_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};

// Remove like
export const removeCommentLike = id => async dispatch => {
  try {
    const res = await api.put(`/api/posts/comment/unlike/${id}`);

    dispatch({
      type: UPDATE_COMMENTLIKES,
      payload: {id, likes: res.data}
    });
  } catch (err) {
    dispatch({
      type: COMMENT_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};

// Delete post
export const deletePost = id => async dispatch => {
  try {
    await api.delete(`/api/posts/${id}`);

    dispatch({
      type: DELETE_POST,
      payload: id
    });

    dispatch(setAlert("Post Removed", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};

// Add post and awsS3 media file to AWS S3
export const addPostAndUploadMedia = formData => async dispatch => {
  let filename = null;
  try {
    const [fileName, fileLocation] = await uploadFile(formData.file);
    filename = fileName;

    const body = {
      "text": formData.text,
      "src": {"url": fileLocation, "type": formData.type}
    };

    const res = await api.post("/api/posts", body, {headers: {"Content-Type": "application/json"}});
    dispatch({
      type: ADD_POST,
      payload: res.data
    });

    dispatch(setAlert("Post Created", "success"));

  } catch (err) {
    await deleteFile(filename);
    dispatch({
      type: POST_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};


// Add post
export const addPost = formData => async dispatch => {
  try {
    const res = await api.post("/api/posts", formData, {headers: {"Content-Type": "application/json"}});
    dispatch({
      type: ADD_POST,
      payload: res.data
    });

    dispatch(setAlert("Post Created", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};

// Get a post by id
export const getPost = (id) => async dispatch => {
  try {
    const res = await api.get(`/api/posts/${id}`);

    dispatch({
      type: GET_POST,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: COMMENT_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};

// Get all commentIds for a particular post
export const getCommentIds = (postId) => async dispatch => {
  try {
    const res = await api.get(`/api/posts/${postId}/commentIds`);

    dispatch({
      type: GET_COMMENTIDS,
      payload: res.data
    });

  } catch (err) {
    dispatch({
      type: COMMENT_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};


// get initial comments by postIds
export const getComments = (commentIds) => async dispatch => {
  if (commentIds.length === 0) {
    dispatch({type: SET_ISLASTPAGE_COMMENT});
  } else {
    dispatch({type: SET_COMMENT_LOADING});
    try {
      const body = {"commentIds": commentIds.slice(0, PAGE_LIMIT)};
      const res = await api.post(`/api/posts/getCommentsByCommentIds`, body, {headers: {"Content-Type": "application/json"}});

      // sort by original order because the cache layer messed up the order
      res.data.sort((x, y) => commentIds.indexOf(x._id) - commentIds.indexOf(y._id));

      dispatch({
        type: GET_COMMENTS,
        payload: {comments: res.data, index: res.data.length}
      });
    } catch (err) {
      dispatch({
        type: COMMENT_ERROR,
        payload: {msg: err.response.statusText, status: err.response.status}
      });
    }
  }
};

// get more comments by commentIds
export const getMoreComments = (commentIds, index) => async dispatch => {
  if (commentIds.length === index) {
    dispatch({type: SET_ISLASTPAGE_COMMENT});
  } else {
    dispatch({type: SET_COMMENT_LOADING});
    try {
      const body = {"commentIds": commentIds.slice(index, index + PAGE_LIMIT)};

      const res = await api.post(`/api/posts/getCommentsByCommentIds`, body, {headers: {"Content-Type": "application/json"}});

      // sort by original order because the cache layer messed up the order
      res.data.sort((x, y) => commentIds.indexOf(x._id) - commentIds.indexOf(y._id));
      dispatch({
        type: GET_MORE_COMMENTS,
        payload: {comments: res.data, index: index + res.data.length}
      });

    } catch (err) {
      dispatch({
        type: COMMENT_ERROR,
        payload: {msg: err.response.statusText, status: err.response.status}
      });
    }
  }
};


// Add comment
export const addComment = (postId, formData, pathname) => async dispatch => {
  try {
    const res = await api.post(`/api/posts/${postId}/comment`, formData, {headers: {"Content-Type": "application/json"}});

    if (pathname === "/dashboard") {
      dispatch({
        type: UPDATE_NUM_OF_COMMENTS,
        payload: {postId, numOfComments: res.data.post.numOfComments}
      });
    } else {
      dispatch({
        type: ADD_COMMENT,
        payload: {post: res.data.post, comment: res.data.newComment}
      });
    }

    dispatch(setAlert("Comment Added", "success"));
  } catch (err) {
    dispatch({
      type: COMMENT_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};


// Add comment
export const addCommentAndUploadMedia = (postId, formData, pathname) => async dispatch => {
  let filename = null;
  try {
    const [fileName, fileLocation] = await uploadFile(formData.file);
    filename = fileName;

    const body = {
      "text": formData.text,
      "replyToId": formData.replyToId,
      "replyToName": formData.replyToName,
      "src": {"url": fileLocation, "type": formData.type}
    };

    const res = await api.post(`/api/posts/${postId}/comment`, body, {headers: {"Content-Type": "application/json"}});

    if (pathname === "/dashboard") {
      dispatch({
        type: UPDATE_NUM_OF_COMMENTS,
        payload: {postId, numOfComments: res.data.post.numOfComments}
      });
    } else {
      dispatch({
        type: ADD_COMMENT,
        payload: {post: res.data.post, comment: res.data.newComment}
      });
    }

    dispatch(setAlert("Comment Added", "success"));
  } catch (err) {
    await deleteFile(filename);
    dispatch({
      type: COMMENT_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};

// Delete comment
export const deleteComment = (postId, commentId) => async dispatch => {
  try {
    await api.delete(`/api/posts/comment/${postId}/${commentId}`);

    dispatch({
      type: DELETE_COMMENT,
      payload: commentId
    });

    dispatch(setAlert("Comment Removed", "success"));
  } catch (err) {
    dispatch({
      type: COMMENT_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};

export const clearComments = () => async dispatch => {
  dispatch({type: CLEAR_COMMENTS});
};
