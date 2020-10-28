import {
  CLEAR_PROFILELIST,
  GET_MORE_PROFILES,
  GET_PROFILEIDS,
  GET_PROFILES,
  NO_PROFILES_FOUND,
  PROFILES_ERROR,
  RESOLVE_INVITE,
  SET_ISLASTPAGE_PROFILES,
  SET_PROFILES_LOADING
} from "../types/types";

const initialState = {
  profileIds: [],
  profiles: [],
  index: null,
  loadingProfiles: true,
  loadingProfileIds: true,
  isLastPage: false,
  error: null
};

export default function(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
    case NO_PROFILES_FOUND:
      return {
        ...state,
        profiles: [],
        loadingProfiles: false,
        loadingProfileIds: false,
        isLastPage: true
      };
    case SET_ISLASTPAGE_PROFILES:
      return {
        ...state,
        isLastPage: true,
        loadingProfileIds: false,
        loadingProfiles: false
      };
    case SET_PROFILES_LOADING:
      return {
        ...state,
        loadingProfiles: true
      };
    case GET_PROFILEIDS:
      return {
        ...state,
        profileIds: payload,
        loadingProfileIds: false
      };
    case GET_PROFILES:
      return {
        ...state,
        profiles: payload.profiles,
        index: payload.index,
        loadingProfiles: false
      };
    case GET_MORE_PROFILES:
      return {
        ...state,
        profiles: [...state.profiles, ...payload.profiles],
        index: payload.index,
        loadingProfiles: false
      };
    case RESOLVE_INVITE:
      return {
        ...state,
        profiles: state.profiles.filter(profile => profile.user !== payload),
        loading: false
      };
    case CLEAR_PROFILELIST:
      return {
        ...state,
        profileIds: [],
        profiles: [],
        loadingProfiles: true,
        loadingProfileIds: true,
        isLastPage: false
      };
    case PROFILES_ERROR:
      return {
        ...state,
        error: payload,
        loadingProfileIds: false,
        loadingProfiles: false
      };
    default:
      return state;
  }
}
