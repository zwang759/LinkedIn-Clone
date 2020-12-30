const express = require("express");
const router = express.Router();
const {check, validationResult, oneOf} = require("express-validator");
const auth = require("../../middleware/auth");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const Comment = require("../../models/Comment");
const checkObjectId = require("../../middleware/checkObjectId");
const redis = require("../../redisClient");
const clearCache = redis.clearCache;
const redisClient = redis.redisClient;
const util = require("util");
redisClient.get = util.promisify(redisClient.get);
const mongoose = require("mongoose");


// @route    POST api/posts
// @desc     Create a post
// @access   Private
router.post(
  "/",
  [auth,
    oneOf([
      check("text").exists().isString(),
      check("src").exists().isString()
    ])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    // start a transaction
    const session = await mongoose.connection.startSession();
    const transactionOptions = {
      readPreference: "primary",
      readConcern: {level: "local"},
      writeConcern: {w: "majority"}
    };
    let field;
    try {
      field = await Profile.findOne({
        user: req.user.id
      }, "name avatar status").lean();
    } catch (e) {
      console.log(e.message);
      return res.status(500).send("Server Error");
    }

    try {
      await session.withTransaction(async () => {
        const newPost = new Post({
          user: req.user.id,
          name: field.name,
          avatar: field.avatar,
          status: field.status,
          text: req.body.text,
          src: req.body.src
        });
        await newPost.save({session});
        await Profile.updateOne(
          {user: req.user.id},
          {$inc: {"numOfPosts": 1}},
          {session});

        res.json(newPost);

        clearCache(`postIdsOfFollowing:${req.user.id}`);
        clearCache(`post:${req.user.id}`);

      }, transactionOptions);
    } catch (e) {
      console.log("The transaction was aborted due to an unexpected error: " + e);
      res.status(500).send("Server Error");
    } finally {
      await session.endSession();
    }
  }
);

// @route    GET api/posts/history/postIds
// @desc     Get postIds by user_id
// @access   Private
router.get("/history/postIds", auth, async (req, res) => {
  try {
    const postIds = await Post.find({user: req.query.userId}, "_id")
      .lean()
      .cache({key: `postIds:${req.query.userId}`});
    res.json(postIds);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// @route    GET api/posts/search
// @desc     Get all matched postIds by search text
// @access   Public
router.get("/search/results", auth, async (req, res) => {
  try {
    const posts = await Post.find(
      {$text: {$search: req.query.keywords}},
      {score: {$meta: "textScore"}, _id: true})
      .sort({score: {$meta: "textScore"}})
      .lean()
      .cache({key: `postIdsOfSearch:${req.query.keywords}`});
    const postIds = posts.map(e => e._id);
    res.json(postIds);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// @route    POST api/posts/getPostsIdsOfFollowing
// @desc     Get postIds of following
// @access   Private
router.post("/getPostIdsOfFollowing",
  auth,
  async (req, res) => {
    try {
      const posts = await Post.find({
        "user": {$in: req.body.followingIds}
      }, "_id")
        .sort({createdAt: -1})
        .lean()
        .cache({key: `postIdsOfFollowing:${req.user.id}`});
      const postIds = posts.map(post => post._id);
      res.json(postIds);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });

// @route    POST api/posts/getPostsByPostIds
// @desc     Get posts by postIds
// @access   Private
router.post("/getPostsByPostIds", auth, async (req, res) => {
  try {
    const keys = req.body.postIds;
    let unCachedList = [];
    let result = [];
    await Promise.all(keys.map(async (singleKey) => {
      const cachedValue = await redisClient.get(`post:${singleKey}`);
      if (!cachedValue) {
        unCachedList.push(singleKey);
      } else {
        result.push(JSON.parse(cachedValue));
      }
    }));

    if (unCachedList.length > 0) {
      const posts = await Post.find({_id: {$in: unCachedList}}).lean();
      await Promise.all(posts.map(async (post) => {
        await redisClient.set(`post:${post._id}`, JSON.stringify(post), "EX", 3600);
      }));
      await result.push(...posts);
    }

    if (!result) return res.status(400).json({msg: "No post found"});

    res.json(result);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
router.delete("/:id", [auth, checkObjectId("id")], async (req, res) => {
  // start a transaction
  const session = await mongoose.connection.startSession();
  const transactionOptions = {
    readPreference: "primary",
    readConcern: {level: "local"},
    writeConcern: {w: "majority"}
  };

  try {
    await session.withTransaction(async () => {
      await Profile.updateOne({user: req.user.id}, {$inc: {"numOfPosts": -1}}, {session});
      await Post.deleteOne({_id: req.params.id, user: req.user.id}, {session});
      await Comment.deleteMany({postId: req.params.id}, {session});

      res.json({msg: "Post removed"});

      clearCache(`postIdsOfFollowing:${req.user.id}`);
      clearCache(`post:${req.params.id}`);

    }, transactionOptions);
  } catch (e) {
    console.log("The transaction was aborted due to an unexpected error: " + e);
    res.status(500).send("Server Error");
  } finally {
    await session.endSession();
  }
});

// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
router.put("/like/:id", [auth, checkObjectId("id")], async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id,
      {$addToSet: {likes: req.user.id}},
      {new: true}).lean();

    res.json(post.likes);

    clearCache(`post:${req.params.id}`);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/posts/unlike/:id
// @desc     Unlike a post
// @access   Private
router.put("/unlike/:id", [auth, checkObjectId("id")], async (req, res) => {
  try {

    const post = await Post.findByIdAndUpdate(req.params.id,
      {$pull: {likes: req.user.id}},
      {new: true}).lean();

    res.json(post.likes);

    clearCache(`post:${req.params.id}`);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private
router.get("/:id", [auth, checkObjectId("id")], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .lean()
      .cache({key: `post:${req.params.id}`});

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/posts/:id/commentIds
// @desc     Get commentIds
// @access   Private
router.get("/:id/commentIds", auth, async (req, res) => {
  try {
    const comments = await Comment.find({
      postId: req.params.id
    }, "_id")
      .sort({createdAt: -1})
      .lean()
      .cache({key: `commentIds:${req.params.id}`});

    const commentIds = comments.map(comment => comment._id);

    return res.json(commentIds);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/posts/getCommentsByCommentIds
// @desc     Get comments by commentIds
// @access   Private
router.post("/getCommentsByCommentIds", auth, async (req, res) => {
  try {
    const keys = req.body.commentIds;
    let unCachedList = [];
    let result = [];
    await Promise.all(keys.map(async (singleKey) => {
      const cachedValue = await redisClient.get(`comment:${singleKey}`);
      if (!cachedValue) {
        unCachedList.push(singleKey);
      } else {
        result.push(JSON.parse(cachedValue));
      }
    }));

    if (unCachedList.length > 0) {
      const comments = await Comment.find({_id: {$in: unCachedList}}).lean();
      await Promise.all(comments.map(async (comment) => {
        await redisClient.set(`comment:${comment._id}`, JSON.stringify(comment), "EX", 3600);
      }));
      await result.push(...comments);
    }

    if (!result) return res.status(400).json({msg: "No post found"});

    res.json(result);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// @route    POST api/posts/comment/:id
// @desc     Comment on a post
// @access   Private
router.post(
  "/:id/comment",
  [
    auth,
    checkObjectId("id"),
    oneOf([
      check("text").exists().isString(),
      check("src").exists().isString()
    ])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    let field;
    try {
      field = await Profile.findOne({
        user: req.user.id
      }, "name avatar status").lean();
    } catch (e) {
      console.log(e.message);
      return res.status(500).send("Server Error");
    }

    // start a transaction
    const session = await mongoose.connection.startSession();
    const transactionOptions = {
      readPreference: "primary",
      readConcern: {level: "local"},
      writeConcern: {w: "majority"}
    };
    try {
      await session.withTransaction(async () => {
        const newComment = new Comment({
          postId: req.params.id,
          user: req.user.id,
          name: field.name,
          avatar: field.avatar,
          status: field.status,
          replyToId: req.body.replyToId,
          replyToName: req.body.replyToName,
          text: req.body.text,
          src: req.body.src
        });

        await newComment.save({session});

        const post = await Post.findOneAndUpdate(
          {_id: req.params.id},
          {$inc: {"numOfComments": 1}},
          {new: true, session});

        res.json({post, newComment});
        clearCache(`post:${req.params.id}`);
        clearCache(`commentIds:${req.params.id}`);

      }, transactionOptions);
    } catch (e) {
      console.log("The transaction was aborted due to an unexpected error: " + e);
      res.status(500).send("Server Error");
    } finally {
      await session.endSession();
    }
  }
);

// @route    PUT api/posts/comment/like/:id
// @desc     Like a comment
// @access   Private
router.put("/comment/like/:id", [auth, checkObjectId("id")], async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id,
      {$addToSet: {likes: req.user.id}},
      {new: true}).lean();

    res.json(comment.likes);

    clearCache(`comment:${req.params.id}`);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/posts/comment/unlike/:id
// @desc     Unlike a comment
// @access   Private
router.put("/comment/unlike/:id", [auth, checkObjectId("id")], async (req, res) => {
  try {

    const comment = await Comment.findByIdAndUpdate(req.params.id,
      {$pull: {likes: req.user.id}},
      {new: true}).lean();

    res.json(comment.likes);

    clearCache(`comment:${req.params.id}`);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  // start a transaction
  const session = await mongoose.connection.startSession();
  const transactionOptions = {
    readPreference: "primary",
    readConcern: {level: "local"},
    writeConcern: {w: "majority"}
  };

  try {
    await session.withTransaction(async () => {
      const comment = await Comment.findByIdAndDelete(req.params.comment_id, {session});
      await Post.updateOne({_id: req.params.id}, {$inc: {"numOfComments": -1}}, {session});

      clearCache(`comment:${req.params.comment_id}`);
      clearCache(`post:${req.params.id}`);

      res.json(comment);

    }, transactionOptions);
  } catch (e) {
    console.log("The transaction was aborted due to an unexpected error: " + e);
    res.status(500).send("Server Error");
  } finally {
    await session.endSession();
  }
});

module.exports = router;
