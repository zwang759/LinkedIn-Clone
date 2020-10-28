import React from "react";
import Dialog from "@material-ui/core/Dialog";
import MenuItem from "@material-ui/core/MenuItem";

const PostButtonModal = (props) => {

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);

  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <MenuItem
        onClick={handleOpen}
        disabled={props.disabled === undefined ? false : props.disabled}
      >
        {props.icon}
      </MenuItem>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        {React.cloneElement(props.content, {handleClose: handleClose})}
      </Dialog>
    </>
  );
};

export default PostButtonModal;