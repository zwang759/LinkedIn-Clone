import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";

const IconModal = (props) => {

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton color="primary" component="span" onClick={handleOpen}>
        {props.icon}
      </IconButton>
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

export default IconModal;