import api from "../utils/api";
import {setAlert} from "./alert";
import {
  ACCOUNT_DELETED,
  CLEAR_COMMENTS,
  CLEAR_POSTS,
  CLEAR_PROFILE,
  GET_HEADER,
  GET_PROFILE,
  GET_REPOS,
  NO_REPOS,
  PROFILE_ERROR,
  RESOLVE_INVITE,
  SET_PROFILE_LOADING,
  UPDATE_PROFILE
} from "../types/types";
import {deleteFile, uploadBase64} from "../utils/aws-s3";


// Get current users header
export const getCurrentHeader = () => async dispatch => {
  try {
    const res = await api.get("/api/profile/me/header");
    dispatch({
      type: GET_HEADER,
      payload: res.data
    });

  } catch (err) {
    console.log(err.message);
  }
};


// Get current users profile
export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await api.get("/api/profile/me");

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};


// Get profile by ID
export const getProfileById = userId => async dispatch => {
  try {
    dispatch({type: SET_PROFILE_LOADING});
    const res = await api.get(`/api/profile/user/${userId}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};

// Get Github repos
export const getGithubRepos = username => async dispatch => {
  try {
    const res = await api.get(`/api/profile/github/${username}`);

    dispatch({
      type: GET_REPOS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: NO_REPOS
    });
  }
};

// Create profile
export const createProfile = (
  formData,
  history,
  id
) => async dispatch => {
  try {

    const res = await api.post("/api/profile", formData, {headers: {"Content-Type": "application/json"}});

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    dispatch(setAlert("Profile Created", "success"));

    history.push(`/profile/${id}`);

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};

// Update Intro
export const updateIntro = (formData) => async dispatch => {
  try {

    const res = await api.put("/api/profile/intro", formData, {headers: {"Content-Type": "application/json"}});

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert("Intro Updated", "success"));

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};

// Update About
export const updateAbout = (formData) => async dispatch => {
  try {

    const res = await api.put("/api/profile/about", formData, {headers: {"Content-Type": "application/json"}});

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert("About Updated", "success"));

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};

// Update Avatar
export const updateAvatar = (avatar) => async dispatch => {
  let filename = null;
  try {
    const [fileName, fileLocation] = await uploadBase64(avatar);
    filename = fileName;

    const body = {avatar: fileLocation};

    const res = await api.put("/api/profile/avatar", body, {headers: {"Content-Type": "application/json"}});

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert("Avatar Updated", "success"));

  } catch (err) {
    await deleteFile(filename);

    if (err) {
      dispatch(setAlert(err.message, "danger"));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};

// Update GitHub username
export const updateGithubusername = (formData) => async dispatch => {
  try {

    const res = await api.put("/api/profile/githubusername", formData, {headers: {"Content-Type": "application/json"}});

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert("GitHub Username Updated", "success"));

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};


// Update Skills
export const updateSkills = (formData) => async dispatch => {
  try {

    const res = await api.put("/api/profile/skills", formData, {headers: {"Content-Type": "application/json"}});

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert("Skills Updated", "success"));

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};

// Add Experience
export const addExperience = (formData) => async dispatch => {
  try {

    const res = await api.put("/api/profile/experience", formData, {headers: {"Content-Type": "application/json"}});

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert("Experience Added", "success"));

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};

// Add Education
export const addEducation = (formData) => async dispatch => {
  try {

    const res = await api.put("/api/profile/education", formData, {headers: {"Content-Type": "application/json"}});

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert("Education Added", "success"));

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};


// Edit Experience
export const editExperience = (id, formData) => async dispatch => {
  try {

    const res = await api.put(`/api/profile/experience/${id}`, formData, {headers: {"Content-Type": "application/json"}});

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert("Experience Edited", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};


// Edit education
export const editEducation = (id, formData) => async dispatch => {
  try {

    const res = await api.put(`/api/profile/education/${id}`, formData, {headers: {"Content-Type": "application/json"}});

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert("Education Edited", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};


// Delete Experience
export const deleteExperience = id => async dispatch => {
  try {
    const res = await api.delete(`/api/profile/experience/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert("Experience Removed", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};

// Delete education
export const deleteEducation = id => async dispatch => {
  try {
    const res = await api.delete(`/api/profile/education/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert("Education Removed", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};

// update view
export const addView = (formData) => async dispatch => {
  try {
    await api.put("/api/profile/view", formData, {headers: {"Content-Type": "application/json"}});

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};


// add Follow
export const addFollow = (formData) => async dispatch => {
  try {
    const res = await api.put("/api/profile/follow", formData, {headers: {"Content-Type": "application/json"}});

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};


// Action Unfollow
export const removeFollow = (formData) => async dispatch => {
  try {
    const res = await api.put("/api/profile/unfollow", formData, {headers: {"Content-Type": "application/json"}});

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};


// add connection (in profile page)
export const ConnectAndUpdateTargetProfile = (formData) => async dispatch => {
  try {
    const res = await api.put("/api/profile/connectAndReturnTargetProfile", formData, {headers: {"Content-Type": "application/json"}});

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};

// add connection in result page
export const ConnectAndUpdateCurrProfile = (formData) => async dispatch => {
  try {
    const res = await api.put("/api/profile/connectAndReturnCurrProfile", formData, {headers: {"Content-Type": "application/json"}});

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};

// remove connection
export const removeConnection = (formData) => async dispatch => {
  try {
    const res = await api.put("/api/profile/unconnect", formData, {headers: {"Content-Type": "application/json"}});

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};

// accept connect
export const acceptConnect = (formData) => async dispatch => {
  try {
    const res = await api.put("/api/profile/accept", formData, {headers: {"Content-Type": "application/json"}});

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch({
      type: RESOLVE_INVITE,
      payload: formData.user
    });

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};

// ignore connect
export const ignoreConnect = (formData) => async dispatch => {
  try {
    await api.put("/api/profile/ignore", formData, {headers: {"Content-Type": "application/json"}});

    dispatch({
      type: RESOLVE_INVITE,
      payload: formData.user
    });

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};


// Delete account & profile
export const deleteAccount = (user) => async dispatch => {
  if (window.confirm("Are you sure? This can NOT be undone!")) {
    try {
      await api.delete(`/api/aws_s3/user?user=${user}`);
      await api.delete("/api/profile");

      dispatch({type: CLEAR_PROFILE});
      dispatch({type: CLEAR_POSTS});
      dispatch({type: CLEAR_COMMENTS});
      dispatch({type: ACCOUNT_DELETED});

      dispatch(setAlert("Your account has been permanently deleted"));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {msg: err.response.statusText, status: err.response.status}
      });
    }
  }
};

// set loading to true
export const setLoading = () => async dispatch => {
  try {
    dispatch({type: SET_PROFILE_LOADING});
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};