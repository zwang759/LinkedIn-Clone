import React from "react";
import Dialog from "@material-ui/core/Dialog";

const CommentButtonModal = (props) => {

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);

  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        disabled={props.disabled === undefined ? false : props.disabled}
      >
        {props.icon}
      </button>
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

export default CommentButtonModal;