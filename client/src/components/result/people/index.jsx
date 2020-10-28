import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {
  clearProfiles,
  getMoreProfilesByUserIds,
  getProfileIdsBySearch,
  getProfilesByUserIds
} from "../../../redux/actions/profiles";
import {Container, Panel, Separator} from "./styles";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ProfileCard from "./ProfileCard";
import {useHistory, useLocation} from "react-router-dom";
import useInfiniteScroll from "../../infinite-scroll/InfiniteScroll";
import LoadingProfileCard from "./LoadingProfileCard";
import {getCurrentProfile} from "../../../redux/actions/profile";
import Spinner from "../../layout/spinner";


const People = ({
                  getCurrentProfile,
                  getProfileIdsBySearch,
                  getProfilesByUserIds,
                  getMoreProfilesByUserIds,
                  clearProfiles,
                  profile: {
                    profile,
                    loadingProfile
                  },
                  profiles: {
                    loadingProfileIds,
                    loadingProfiles,
                    profileIds,
                    index,
                    profiles,
                    isLastPage
                  }
                }) => {

  const keywords = useLocation().search.slice(10);
  const history = useHistory();
  const [searchIn, setSearchIn] = React.useState("People");

  React.useEffect(() => {
    if (!profile) {
      getCurrentProfile();
    }
    return () => {
      clearProfiles();
    };
  }, []);

  React.useEffect(() => {
    getProfileIdsBySearch(keywords);
  }, [keywords]);

  React.useEffect(() => {
    if (!loadingProfileIds) {
      getProfilesByUserIds(profileIds);
    }
  }, [profileIds]);

  const fetchMoreListItems = () => {
    if (!isLastPage && !loadingProfiles) {
      getMoreProfilesByUserIds(profileIds, index);
    }
    setIsFetching(false);
  };

  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);

  const handleChange = (e) => {
    setSearchIn(e.target.value);
  };

  React.useEffect(() => {
    if (searchIn === "Content") {
      history.push(`/search/results/content/?keywords=${keywords}`);
    }
  }, [searchIn]);

  return (
    <>
      {loadingProfile ?
        <Spinner /> :
        <>
          <Panel className="filter-Panel">
            <FormControl variant="filled" size="small" style={{marginLeft: "62px"}}>
              <InputLabel>In</InputLabel>
              <Select
                value={searchIn}
                onChange={handleChange}
              >
                <MenuItem value="People">People</MenuItem>
                <MenuItem value="Content">Content</MenuItem>
              </Select>
            </FormControl>
          </Panel>


          {loadingProfileIds ?
            <Spinner /> :
            <Container>
              <Panel className="display-Panel">
                <div>
                  <Typography variant="body2"
                              color="textSecondary">About {profileIds.length} results</Typography>
                </div>
                {loadingProfiles ? profileIds.slice(0, 10).map(profileId =>
                    <React.Fragment key={profileId}>
                      <LoadingProfileCard />
                      <Separator />
                    </React.Fragment>)
                  : profiles.map(profileCard =>
                    <React.Fragment key={profileCard.user}>
                      <ProfileCard
                        connections={profile.connections}
                        invitationSent={profile.invitationSent}
                        invitationReceived={profile.invitationReceived}
                        user={profileCard.user}
                        name={profileCard.name}
                        avatar={profileCard.avatar}
                        location={profileCard.location}
                        status={profileCard.status}
                      />
                      <Separator />
                    </React.Fragment>)}
              </Panel>
              {isFetching && !isLastPage && <LoadingProfileCard />}
            </Container>
          }
        </>
      }
    </>
  );
};

People.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  getProfileIdsBySearch: PropTypes.func.isRequired,
  getProfilesByUserIds: PropTypes.func.isRequired,
  getMoreProfilesByUserIds: PropTypes.func.isRequired,
  clearProfiles: PropTypes.func.isRequired,
  profiles: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  profiles: state.profiles
});

export default connect(
  mapStateToProps,
  {getCurrentProfile, getProfileIdsBySearch, getProfilesByUserIds, getMoreProfilesByUserIds, clearProfiles})
(People);