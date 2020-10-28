import React from "react";
import SpinnerSmall from "../../layout/spinnerSmall";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import {makeStyles} from "@material-ui/core/styles";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Typography from "@material-ui/core/Typography";
import {BsFillPeopleFill, BsHash, BsPeopleCircle} from "react-icons/bs";
import {IoIosPeople} from "react-icons/io";
import Grid from "@material-ui/core/Grid";
import {Container, Panel} from "./styles";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  icon: {
    color: "black"
  }
}));

const ManageMyNetwork = ({connections, following, followers, loading}) => {
  const classes = useStyles();

  return (
    <Container>
      <Panel>
        {loading ? (
            <SpinnerSmall />
          ) :
          <>
            <Typography variant="inherit">Manage my network</Typography>
            <MenuList>
              <MenuItem>
                <ListItemIcon className={classes.icon}>
                  <BsFillPeopleFill size={25} />
                </ListItemIcon>
                <Grid container justify="space-between">
                  <Typography variant="inherit" noWrap>Connections</Typography>
                  <Typography variant="inherit"
                              noWrap>{connections.length}</Typography>
                </Grid>
              </MenuItem>
              <MenuItem>
                <ListItemIcon className={classes.icon}>
                  <BsPeopleCircle size={25} />
                </ListItemIcon>
                <Typography variant="inherit" noWrap>People | Follow</Typography>
              </MenuItem>
              <MenuItem>
                <ListItemIcon className={classes.icon}>
                  <IoIosPeople size={25} />
                </ListItemIcon>
                <Typography variant="inherit" noWrap>Groups</Typography>
              </MenuItem>
              <MenuItem>
                <ListItemIcon className={classes.icon}>
                  <BsHash size={25} />
                </ListItemIcon>
                <Typography variant="inherit" noWrap>Hashtags</Typography>
              </MenuItem>
            </MenuList>
          </>}
      </Panel>
    </Container>
  );
};

ManageMyNetwork.propTypes = {
  connections: PropTypes.array,
  loading: PropTypes.bool.isRequired
};

export default ManageMyNetwork;