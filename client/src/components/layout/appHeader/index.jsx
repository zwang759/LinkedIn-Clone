import React from "react";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";

import {
  CaretDownIcon,
  Container,
  HomeIcon,
  LinkedInIcon,
  NetworkIcon,
  NotificationsIcon,
  ProfileCircle,
  SearchInput,
  Wrapper
} from "./styles";
import {useHistory} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logout} from "../../../redux/actions/auth";
import {deleteAccount, getCurrentHeader} from "../../../redux/actions/profile";


const Header = ({
                  profile: {profile, header},
                  auth: {user, isAuthenticated, loading},
                  logout,
                  getCurrentHeader,
                  deleteAccount
                }) => {

  React.useEffect(() => {
    if (isAuthenticated && !header) {
      getCurrentHeader();
    }
  }, [profile]);

  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  };

  const handleViewProfile = () => {
    history.push(`/profile/${user._id}`);
    setOpen(false);
  };

  const [keywords, setKeywords] = React.useState("");

  const onChange = (e) => {
    setKeywords(e.target.value);
  };

  const onKeyDownSearch = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (history.location.pathname !== "/search/results/content/"
        || history.location.pathname !== "/search/results/people/") {
        history.push(`/search/results/people/?keywords=${keywords}`);
      }
    }
  };

  const onClickLogout = () => {
    logout();
    setOpen(false);
    history.push("/login");
  };

  const onClickDeleteAccount = () => {
    deleteAccount(user._id);
    history.push("/login");
  };

  return (
    <Container>
      <Wrapper>
        <div className="left">
          <LinkedInIcon />
          <form onKeyDown={onKeyDownSearch}>
            <SearchInput type="text" placeholder="Search..." onChange={onChange} />
          </form>
        </div>

        {!loading && (
          <>{isAuthenticated && header ? <div className="right">
            <nav>
              <button onClick={() => history.push("/dashboard")}>
                <HomeIcon />
                Home
              </button>

              <button onClick={() => history.push("/mynetwork")}>
                <NetworkIcon />
                My Network
              </button>

              <button>
                <NotificationsIcon />
                <span>Notification</span>
              </button>

              <button
                ref={anchorRef}
                aria-controls={open ? "menu-list-grow" : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
              >
                <ProfileCircle src={header} />
                <span>
                        Me <CaretDownIcon />
                    </span>
              </button>
              <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({TransitionProps, placement}) => (
                  <Grow
                    {...TransitionProps}
                    style={{transformOrigin: placement === "bottom" ? "center top" : "center bottom"}}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                          <MenuItem onClick={handleViewProfile}>View Profile</MenuItem>
                          <MenuItem onClick={onClickLogout}>Logout</MenuItem>
                          <MenuItem onClick={onClickDeleteAccount}>Delete this account</MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </nav>
          </div> : <div className="right">
            <nav>
              <button onClick={() => history.push("/register")}><span style={{fontWeight: 600}}>Sign Up</span></button>
              <button onClick={() => history.push("/login")}><span style={{fontWeight: 600}}>Sign In</span></button>
            </nav>
          </div>}</>
        )}

      </Wrapper>
    </Container>
  );
};

Header.propTypes = {
  header: PropTypes.string,
  logout: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object
};


const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, {logout, getCurrentHeader, deleteAccount})(Header);
