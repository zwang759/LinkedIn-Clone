import {
  ADD_COMMENT,
  CLEAR_COMMENTS,
  COMMENT_ERROR,
  DELETE_COMMENT,
  GET_COMMENTIDS,
  GET_COMMENTS,
  GET_MORE_COMMENTS,
  GET_POST,
  SET_COMMENT_LOADING,
  SET_ISLASTPAGE_COMMENT,
  UPDATE_COMMENTLIKES,
  UPDATE_LIKE_FOR_POST
} from "../types/types";

const initialState = {
  loadingCommentIds: true,
  loadingComments: true,
  index: null,
  loadingPost: true,
  isLastPage: false,
  post: null,
  commentIds: [],
  comments: [],
  error: null
};

export default function(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
    case SET_ISLASTPAGE_COMMENT:
      return {
        ...state,
        loadingCommentIds: false,
        loadingComments: false,
        isLastPage: true
      };
    case SET_COMMENT_LOADING:
      return {
        ...state,
        loadingComments: true
      };
    case GET_POST:
      return {
        ...state,
        post: payload,
        loadingPost: false
      };
    case GET_COMMENTIDS:
      return {
        ...state,
        commentIds: payload,
        loadingCommentIds: false
      };
    case GET_COMMENTS:
      return {
        ...state,
        comments: payload.comments,
        index: payload.index,
        loadingComments: false
      };
    case GET_MORE_COMMENTS:
      return {
        ...state,
        comments: [...state.comments, ...payload.comments],
        index: payload.index,
        loadingComments: false
      };
    case CLEAR_COMMENTS:
      return {
        ...state,
        loadingCommentIds: true,
        loadingComments: true,
        isLastPage: false,
        commentIds: [],
        comments: [],
        index: null
      };
    case COMMENT_ERROR:
      return {
        ...state,
        error: payload,
        loadingCommentIds: false,
        loadingComments: false
      };
    case UPDATE_LIKE_FOR_POST:
      return {
        ...state,
        post: {...state.post, likes: payload.likes}
      };
    case UPDATE_COMMENTLIKES: {
      return {
        ...state,
        comments: state.comments.map(comment =>
          comment._id === payload.id ? {...comment, likes: payload.likes} : comment
        )
      };
    }
    case ADD_COMMENT:
      return {
        ...state,
        post: payload.post,
        comments: [payload.comment, ...state.comments]
      };
    case DELETE_COMMENT:
      return {
        ...state,
        commentIds: state.commentIds.filter(commentId => commentId !== payload),
        comments: state.comments.filter(comment => comment._id !== payload)
      };
    default:
      return state;
  }
}
