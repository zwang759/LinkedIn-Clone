const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const AWS = require("aws-sdk");
const config = require("config");
const bucketName = config.get("S3_BUCKET_NAME");
const s3 = new AWS.S3({
  accessKeyId: config.get("AWSAccessKeyId"),
  secretAccessKey: config.get("AWSSecretKey")
});
const signedUrlExpireSeconds = config.get("signedUrlExpireSeconds");

const deleteFile = async (filename) => {

  const params = {
    Bucket: bucketName,
    Key: filename
  };

  try {
    await s3.deleteObject(params).promise();

    console.log(`File deleted successfully`);

  } catch (s3Err) {
    console.log(s3Err.message);
  }
};

const deleteAlbum = async (user) => {
  const albumKey = user + "/";

  const params = {
    Bucket: bucketName,
    Prefix: albumKey
  };
  try {
    const data = await s3.listObjects(params).promise();
    const objects = data.Contents.map(function(object) {
      return {Key: object.Key};
    });
    try {
      await s3.deleteObjects(
        {
          Bucket: bucketName,
          Delete: {Objects: objects}
        }).promise();
      console.log("Successfully deleted album.");
    } catch (s3Err) {
      console.log(s3Err.message);
    }
  } catch (s3Err) {
    console.log(s3Err.message);
  }
};


// @route    GET api/aws_s3/sign_put
// @desc     Get pre-signed put url for uploading file
// @access   Private
router.get("/sign_put", auth, async (req, res) => {
  try {
    const contentType = req.query.contentType;
    // Validate the content type
    if (!contentType) {
      return res.status(422).json({msg: "No contentType found"});
    }
    const filename = req.user.id + "/" + Date.now();

    const url = await s3.getSignedUrlPromise("putObject", {
      Bucket: bucketName,
      Key: filename,
      ContentType: contentType,
      Expires: signedUrlExpireSeconds,
      ACL: "public-read"
    });

    res.json({filename, url});

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// @route    GET api/aws_s3/sign_put_base64
// @desc     Get pre-signed put url for uploading base64 image
// @access   Private
router.get("/sign_put_base64", auth, async (req, res) => {
  try {
    const type = req.query.contentType;
    const filename = req.user.id + "/" + Date.now();

    const url = await s3.getSignedUrlPromise("putObject", {
      Bucket: bucketName,
      Key: filename,
      ContentType: `image/${type}`,
      Expires: signedUrlExpireSeconds,
      ACL: "public-read",
      ContentEncoding: "base64"
    });

    res.json({filename, url});

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    DELETE api/aws_s3/filename
// @desc     Delete this file
// @access   Private
router.delete("/file", auth, async (req, res) => {
  try {
    const filename = req.query.filename;
    console.log(filename);
    await deleteFile(filename);
    res.status(200).json({msg: "success"});

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    DELETE api/aws_s3/user
// @desc     Delete all files for this user
// @access   Private
router.delete("/user", auth, async (req, res) => {
  try {
    const user = req.query.user;
    await deleteAlbum(user);

    res.status(200).json({msg: "success"});

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
