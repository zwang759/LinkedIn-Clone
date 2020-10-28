import {
  ADD_POST,
  CLEAR_POSTS,
  DELETE_POST,
  GET_MORE_POSTS,
  GET_POSTIDS,
  GET_POSTS,
  NO_POSTS_FOUND,
  POST_ERROR,
  SET_ISLASTPAGE_POST,
  SET_POST_LOADING,
  UPDATE_LIKES,
  UPDATE_NUM_OF_COMMENTS
} from "../types/types";

const initialState = {
  postIds: [],
  posts: [],
  index: null,
  loadingPostIds: true,
  loading: true,
  isLastPage: false,
  error: null
};

export default function(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
    case SET_ISLASTPAGE_POST:
      return {
        ...state,
        loading: false,
        isLastPage: true
      };
    case NO_POSTS_FOUND:
      return {
        ...state,
        index: null,
        posts: [],
        loadingPostIds: false,
        loading: false,
        isLastPage: true
      };
    case SET_POST_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_POSTIDS:
      return {
        ...state,
        postIds: payload,
        loadingPostIds: false
      };
    case GET_POSTS:
      return {
        ...state,
        posts: payload.posts,
        index: payload.index,
        loading: false
      };
    case GET_MORE_POSTS:
      return {
        ...state,
        posts: [...state.posts, ...payload.posts],
        index: payload.index,
        loading: false
      };
    case CLEAR_POSTS:
      return {
        ...state,
        postIds: [],
        posts: [],
        loadingPostIds: true,
        loading: true,
        isLastPage: false,
        index: null
      };
    case ADD_POST:
      return {
        ...state,
        posts: [payload, ...state.posts],
        loading: false
      };
    case DELETE_POST:
      return {
        ...state,
        postIds: state.postIds.filter(postId => postId !== payload),
        posts: state.posts.filter(post => post._id !== payload),
        loading: false
      };
    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loadingPostIds: false,
        loading: false
      };
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === payload.id ? {...post, likes: payload.likes} : post
        )
      };
    case UPDATE_NUM_OF_COMMENTS:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === payload.postId ? {...post, numOfComments: payload.numOfComments} : post
        )
      };
    default:
      return state;
  }
}
