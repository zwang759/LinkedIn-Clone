import axios from "axios";
import store from "../store";
import {CLEAR_COMMENTS, CLEAR_POSTS, CLEAR_PROFILE, LOGOUT} from "../types/types";

const api = axios.create({timeout: 10000});
/**
 intercept any error responses from the api
 and check if the token is no longer valid.
 ie. Token has expired or user is no longer
 authenticated.
 logout the user if the token has expired
 **/

api.interceptors.response.use(
  res => res,
  err => {
    console.log(err);
    if (err.response.status === 401) {
      store.dispatch({type: CLEAR_POSTS});
      store.dispatch({type: CLEAR_PROFILE});
      store.dispatch({type: CLEAR_COMMENTS});
      store.dispatch({type: LOGOUT});
    }
    return Promise.reject(err);
  }
);

export default api;