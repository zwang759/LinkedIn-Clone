import React, {lazy, Suspense} from "react";
import {Route, Switch} from "react-router-dom";
import {connect} from "react-redux";
import {loadUser, logout} from "./redux/actions/auth";
import setAuthToken from "./redux/utils/setAuthToken";
import GlobalStyles from "./styles/GlobalStyles";
import Header from "./components/layout/appHeader";
import PrivateRoute from "./components/routing/PrivateRoute";
import Alert from "./components/layout/alert";
import Spinner from "./components/layout/spinner";

// Lazy load routes as necessary
const Landing = lazy(() => import("./components/landing"));
const Register = lazy(() => import("./components/auth/Register"));
const Login = lazy(() => import("./components/auth/Login"));
const Network = lazy(() => import("./components/network"));
const Profile = lazy(() => import("./components/profile/Profile"));
const People = lazy(() => import("./components/result/people"));
const Dashboard = lazy(() => import("./components/dashboard"));
const ProfileForm = lazy(() => import("./components/profile-forms/ProfileForm"));
const Comments = lazy(() => import("./components/comments/Comments"));
const NotFound = lazy(() => import("./components/layout/notFound"));
const Content = lazy(() => import("./components/result/content/Content"));


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
      <Suspense fallback={<Spinner />}>
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
      </Suspense>
    </>
  );
};


export default connect(null, {loadUser, logout})(App);
