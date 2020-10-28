import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";

const useStyles = makeStyles((theme) => ({
  large: {
    width: 150,
    height: 150
  },
  reduceLeftMargin: {
    marginLeft: 0
  }
}));

const AvatarModel = (props) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>{props.user === props.userId ?
      <>
        <IconButton className={classes.reduceLeftMargin} onClick={handleOpen}>
          <Avatar className={classes.large} src={props.avatar} />
        </IconButton>
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth
          maxWidth="sm"
        >
          {React.cloneElement(props.content, {handleClose: handleClose})}
        </Dialog>
      </> :
      <IconButton className={classes.reduceLeftMargin}>
        <Avatar className={classes.large} src={props.avatar} />
      </IconButton>
    }
    </>
  );
};

export default AvatarModel;