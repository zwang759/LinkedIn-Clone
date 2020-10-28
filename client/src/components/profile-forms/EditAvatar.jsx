import React, {useState} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {updateAvatar} from "../../redux/actions/profile";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Grid from "@material-ui/core/Grid";
import {IconButton} from "@material-ui/core";
import {AiOutlineClose} from "react-icons/ai";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  root: {
    textTransform: "none"
  }
});

const scaleImage = (img, quality) => {
  let canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
  let max_size = 256;
  while (canvas.width >= (2 * max_size)) {
    canvas = getHalfScaleCanvas(canvas);
  }
  if (canvas.width > max_size) {
    canvas = scaleCanvasWithAlgorithm(canvas, max_size);
  }
  return canvas.toDataURL("image/jpeg", quality);
};

const scaleCanvasWithAlgorithm = (canvas, max_size) => {
  let scaledCanvas = document.createElement("canvas");
  let scale = max_size / canvas.width;
  scaledCanvas.width = canvas.width * scale;
  scaledCanvas.height = canvas.height * scale;
  let srcImgData = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
  let destImgData = scaledCanvas.getContext("2d").createImageData(scaledCanvas.width, scaledCanvas.height);
  applyBilinearInterpolation(srcImgData, destImgData, scale);
  scaledCanvas.getContext("2d").putImageData(destImgData, 0, 0);
  return scaledCanvas;
};

const getHalfScaleCanvas = (canvas) => {
  let halfCanvas = document.createElement("canvas");
  halfCanvas.width = canvas.width / 2;
  halfCanvas.height = canvas.height / 2;
  halfCanvas.getContext("2d").drawImage(canvas, 0, 0, halfCanvas.width, halfCanvas.height);
  return halfCanvas;
};

const applyBilinearInterpolation = (srcCanvasData, destCanvasData, scale) => {
  const inner = (f00, f10, f01, f11, x, y) => {
    let un_x = 1.0 - x;
    let un_y = 1.0 - y;
    return (f00 * un_x * un_y + f10 * x * un_y + f01 * un_x * y + f11 * x * y);
  };
  let i, j;
  let iyv, iy0, iy1, ixv, ix0, ix1;
  let idxD, idxS00, idxS10, idxS01, idxS11;
  let dx, dy;
  let r, g, b, a;
  for (i = 0; i < destCanvasData.height; i++) {
    iyv = i / scale;
    iy0 = Math.floor(iyv);
    // Math.ceil can go over bounds
    iy1 = (Math.ceil(iyv) > (srcCanvasData.height - 1) ? (srcCanvasData.height - 1) : Math.ceil(iyv));
    for (j = 0; j < destCanvasData.width; j++) {
      ixv = j / scale;
      ix0 = Math.floor(ixv);
      // Math.ceil can go over bounds
      ix1 = (Math.ceil(ixv) > (srcCanvasData.width - 1) ? (srcCanvasData.width - 1) : Math.ceil(ixv));
      idxD = (j + destCanvasData.width * i) * 4;
      // matrix to vector indices
      idxS00 = (ix0 + srcCanvasData.width * iy0) * 4;
      idxS10 = (ix1 + srcCanvasData.width * iy0) * 4;
      idxS01 = (ix0 + srcCanvasData.width * iy1) * 4;
      idxS11 = (ix1 + srcCanvasData.width * iy1) * 4;
      // overall coordinates to unit square
      dx = ixv - ix0;
      dy = iyv - iy0;
      // I let the r, g, b, a on purpose for debugging
      r = inner(srcCanvasData.data[idxS00], srcCanvasData.data[idxS10], srcCanvasData.data[idxS01], srcCanvasData.data[idxS11], dx, dy);
      destCanvasData.data[idxD] = r;

      g = inner(srcCanvasData.data[idxS00 + 1], srcCanvasData.data[idxS10 + 1], srcCanvasData.data[idxS01 + 1], srcCanvasData.data[idxS11 + 1], dx, dy);
      destCanvasData.data[idxD + 1] = g;

      b = inner(srcCanvasData.data[idxS00 + 2], srcCanvasData.data[idxS10 + 2], srcCanvasData.data[idxS01 + 2], srcCanvasData.data[idxS11 + 2], dx, dy);
      destCanvasData.data[idxD + 2] = b;

      a = inner(srcCanvasData.data[idxS00 + 3], srcCanvasData.data[idxS10 + 3], srcCanvasData.data[idxS01 + 3], srcCanvasData.data[idxS11 + 3], dx, dy);
      destCanvasData.data[idxD + 3] = a;
    }
  }
};


const EditAvatar = ({
                      auth,
                      currAvatar,
                      updateAvatar,
                      handleClose
                    }) => {
  const classes = useStyles();

  const [avatar, setAvatar] = useState(currAvatar);

  const toBase64 = async file => await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = (event) => {
      reject("File could not be read: ", event.target.error);
    };
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(file);
  }).then(async dataUrl => await new Promise((resolve, reject) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => resolve(scaleImage(img, 1));
    img.onerror = err => reject(err);
  }));

  const onChange = async e => {
    let img = e.target.files[0];
    if (img === null) alert("No file found");
    else if (img.size / 1024 / 1024 > 5) alert("File size exceeds 5 MB");
    else {
      setAvatar(await toBase64(img));
    }
  };

  const onSubmit = () => {
    updateAvatar(avatar);
    handleClose();
  };

  return (
    <>
      <DialogTitle>
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            Edit avatar
          </Grid>
          <Grid item>
            <IconButton onClick={() => handleClose()}>
              <AiOutlineClose />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent dividers>
        <Button component="label" fullWidth>
          Upload your avatar
          <input
            type="file"
            accept="image/*"
            onChange={onChange}
            style={{display: "none"}}
          />
        </Button>
        {avatar &&
        <Grid container justify="center">
          <img src={avatar} alt='' />
        </Grid>
        }
      </DialogContent>
      <DialogActions>
        <Grid container justify="space-between">
          <Button variant="outlined" className={classes.root} onClick={() => handleClose()}> Discard </Button>
          <Button variant="contained" className={classes.root} color="primary" onClick={onSubmit}> Save </Button>
        </Grid>
      </DialogActions>
    </>
  );
};

EditAvatar.propTypes = {
  updateAvatar: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {updateAvatar})(EditAvatar);