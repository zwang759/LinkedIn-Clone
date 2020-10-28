import {combineReducers} from "redux";
import alert from "./alert";
import auth from "./auth";
import profile from "./profile";
import post from "./post";
import comment from "./comment";
import profiles from "./profiles";

export default combineReducers({
  alert,
  auth,
  profile,
  profiles,
  post,
  comment
});
