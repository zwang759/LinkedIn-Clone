import api from "../utils/api";
import {
  CLEAR_PROFILELIST,
  GET_MORE_PROFILES,
  GET_PROFILEIDS,
  GET_PROFILES,
  NO_PROFILES_FOUND,
  PROFILES_ERROR,
  SET_ISLASTPAGE_PROFILES,
  SET_PROFILES_LOADING
} from "../types/types";
import {PAGE_LIMIT} from "../../enum/enum";


// Get profiles by search text
export const getProfileIdsBySearch = (keywords) => async dispatch => {
  try {
    const res = await api.get(`/api/profile/search/results?keywords=${keywords}`);
    dispatch({type: GET_PROFILEIDS, payload: res.data});

  } catch (err) {
    dispatch({
      type: PROFILES_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};

// Get profile by userIds
export const getProfilesByUserIds = userIds => async dispatch => {
  if (userIds.length === 0) {
    dispatch({type: NO_PROFILES_FOUND});
  } else {
    try {
      dispatch({type: SET_PROFILES_LOADING});

      const body = {"userIds": userIds.slice(0, PAGE_LIMIT)};
      const res = await api.post(`/api/profile/getProfilesByUserIds`, body, {headers: {"Content-Type": "application/json"}});

      // sort array based on its original order because the cache layer messed up the order
      res.data.sort((x, y) => userIds.indexOf(x._id) - userIds.indexOf(y._id));

      dispatch({
        type: GET_PROFILES,
        payload: {profiles: res.data, index: res.data.length}
      });
    } catch (err) {
      dispatch({
        type: PROFILES_ERROR,
        payload: {msg: err.response.statusText, status: err.response.status}
      });
    }
  }
};

// Get profile by userIds
export const getMoreProfilesByUserIds = (userIds, index) => async dispatch => {
  if (userIds.length === 0) {
    dispatch({type: SET_ISLASTPAGE_PROFILES});
  } else {
    try {
      dispatch({type: SET_PROFILES_LOADING});

      const body = {"userIds": userIds.slice(index, index + PAGE_LIMIT)};
      const res = await api.post(`/api/profile/getProfilesByUserIds`, body, {headers: {"Content-Type": "application/json"}});

      // sort array based on its original order because the cache layer messed up the order
      res.data.sort((x, y) => userIds.indexOf(x._id) - userIds.indexOf(y._id));

      dispatch({
        type: GET_MORE_PROFILES,
        payload: {profiles: res.data, index: index + res.data.length}
      });
    } catch (err) {
      dispatch({
        type: PROFILES_ERROR,
        payload: {msg: err.response.statusText, status: err.response.status}
      });
    }
  }
};


// clear profiles state
export const clearProfiles = () => async dispatch => {
  dispatch({type: CLEAR_PROFILELIST});
};