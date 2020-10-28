import {setAlert} from "./alert";
import {
  AUTH_ERROR,
  CLEAR_COMMENTS,
  CLEAR_POSTS,
  CLEAR_PROFILE,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOADED
} from "../types/types";
import api from "../utils/api";

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    const res = await api.get("/api/auth");

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register User
export const register = (formData) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);
    const res = await api.post("/api/users", body, {headers: {"Content-Type": "application/json"}});

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Login User
export const login = (formData) => async (dispatch) => {

  try {
    const body = JSON.stringify(formData);
    const res = await api.post("/api/auth", body, {headers: {"Content-Type": "application/json"}});
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    console.log(err);
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: LOGIN_FAIL
    });
  }
};

// Logout / Clear Profile
export const logout = () => (dispatch) => {
  dispatch({type: CLEAR_POSTS});
  dispatch({type: CLEAR_PROFILE});
  dispatch({type: CLEAR_COMMENTS});
  dispatch({type: LOGOUT});
};
