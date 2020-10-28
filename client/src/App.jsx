import React from "react";
import {Route, Switch} from "react-router-dom";
import {connect} from "react-redux";
import {loadUser, logout} from "./redux/actions/auth";
import setAuthToken from "./redux/utils/setAuthToken";
import GlobalStyles from "./styles/GlobalStyles";
import Header from "./components/layout/appHeader";
import Landing from "./components/landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/routing/PrivateRoute";
import Network from "./components/network";
import Profile from "./components/profile/Profile";
import People from "./components/result/people";
import Dashboard from "./components/dashboard";
import ProfileForm from "./components/profile-forms/ProfileForm";
import Comments from "./components/comments/Comments";
import NotFound from "./components/layout/notFound";
import Alert from "./components/layout/alert";
import Content from "./components/result/content/Content";

const App = ({loadUser, logout}) => {
  React.useEffect(() => {
    setAuthToken(localStorage.token);
    loadUser();

    // log user out from all tabs if they log out in one tab
    window.addEventListener("storage", () => {
      if (!localStorage.token) {
        logout();
      }
    });
  }, []);

  return (
    <>
      <GlobalStyles />
      <Header />
      <Alert />
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <PrivateRoute exact path="/mynetwork" component={Network} />
        <PrivateRoute exact path="/profile/:id" component={Profile} />
        <PrivateRoute exact path="/search/results/people" component={People} />
        <PrivateRoute exact path="/search/results/content" component={Content} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute exact path="/create-profile" component={ProfileForm} />
        <PrivateRoute exact path="/post/:id" component={Comments} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
};


export default connect(null, {loadUser, logout})(App);
