import {
  CLEAR_PROFILE,
  GET_HEADER,
  GET_PROFILE,
  GET_REPOS,
  NO_REPOS,
  PROFILE_ERROR,
  SET_ISLASTPAGE_PROFILE,
  SET_PROFILE_LOADING,
  UPDATE_PROFILE
} from "../types/types";

const initialState = {
  header: null,
  profile: null,
  repos: [],
  loadingProfile: true,
  loadingRepos: true,
  isLastPage: false,
  error: null
};

export default function(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
    case SET_ISLASTPAGE_PROFILE:
      return {
        ...state,
        isLastPage: true,
        loadingProfile: false
      };
    case SET_PROFILE_LOADING:
      return {
        ...state,
        loadingProfile: true
      };
    case GET_HEADER:
      return {
        ...state,
        header: payload
      };
    case GET_PROFILE:
      return {
        ...state,
        profile: payload,
        loadingProfile: false
      };
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        header: payload.avatar,
        loadingProfile: false
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loadingProfile: false
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        header: null,
        profile: null,
        profiles: [],
        repos: [],
        loadingProfile: true,
        isLastPage: false
      };
    case GET_REPOS:
      return {
        ...state,
        repos: payload,
        loadingRepos: false
      };
    case NO_REPOS:
      return {
        ...state,
        repos: [],
        loadingRepos: false
      };
    default:
      return state;
  }
}
