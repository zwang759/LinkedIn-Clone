const express = require("express");
const axios = require("axios");
const config = require("config");
const router = express.Router();
const auth = require("../../middleware/auth");
const {check, validationResult} = require("express-validator");
const checkObjectId = require("../../middleware/checkObjectId");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const redis = require("../../redisClient");
const clearCache = redis.clearCache;
const redisClient = redis.redisClient;
const mongoose = require("mongoose");

// @route    GET api/profile/me/header
// @desc     Get current users header
// @access   Private
router.get("/me/header", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.user.id}, "avatar")
      .lean()
      .cache({key: `header:${req.user.id}`});

    if (!profile) {
      return res.status(400).json({msg: "There is no profile for this user"});
    }

    res.json(profile.avatar);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.user.id})
      .lean()
      .cache({key: `profile:${req.user.id}`});

    if (!profile) {
      return res.status(400).json({msg: "There is no profile for this user"});
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post(
  "/",
  [auth,
    [
      check("name", "Name is required").not().isEmpty(),
      check("status", "Status is required").not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    const {
      name,
      location,
      about,
      skills,
      status,
      githubusername
    } = req.body;


    const profileFields = {
      user: req.user.id,
      name,
      location,
      about,
      skills: Array.isArray(skills)
        ? skills
        : skills.length === 0 ? [] : skills.split(",").map((skill) => skill.trim()),
      status,
      githubusername
    };

    try {
      // Using upsert option (creates new doc if no match is found):
      const profile = await Profile.findOneAndUpdate(
        {user: req.user.id},
        {$set: profileFields},
        {new: true, upsert: true, setDefaultsOnInsert: true}
      ).lean();

      res.json(profile);

      clearCache(`profile:${req.user.id}`);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    GET api/profile/user/:userId
// @desc     Get profile by user ID
// @access   Public
router.get(
  "/user/:userId",
  [
    auth,
    checkObjectId("userId")
  ],
  async (req, res) => {
    try {
      const profile = await Profile.findOne({user: req.params.userId})
        .lean()
        .cache({key: `profile:${req.params.userId}`});

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({msg: "Server error"});
    }
  }
);


// @route    GET api/profile/search/results
// @desc     Get all matched userIds by keywords
// @access   Private
router.get("/search/results",
  auth,
  async (req, res) => {
    try {
      const profiles = await Profile.find(
        {$text: {$search: req.query.keywords}},
        {score: {$meta: "textScore"}, user: true})
        .lean()
        .cache({key: `profileIdsOfSearch:${req.query.keywords}`});

      const profileIds = profiles.map(profile => profile.user);

      res.json(profileIds);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });


// @route    POST api/profile/getProfilesByUserIds
// @desc     Get profiles by a list of userIds
// @access   Private
router.post("/getProfilesByUserIds",
  auth,
  async (req, res) => {
    try {
      let unCachedList = [];
      let result = [];
      await Promise.all(req.body.userIds.map(async (userId) => {
        const cachedValue = await redisClient.get(`profile:${userId}`);
        if (!cachedValue) {
          unCachedList.push(userId);
        } else {
          result.push(JSON.parse(cachedValue));
        }
      }));

      if (unCachedList.length > 0) {
        const profiles = await Profile.find({user: {$in: unCachedList}}, "user name avatar status location").lean();
        await Promise.all(profiles.map(async (profile) => {
          await redisClient.set(`profile:${profile.user}`, JSON.stringify(profile), "EX", 3600);
        }));
        await result.push(...profiles);
      }

      if (!result) return res.status(404).json({msg: "No profile found"});

      res.json(result);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });


// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete("/", auth, async (req, res) => {

  // start a transaction
  const session = await mongoose.connection.startSession();
  const transactionOptions = {
    readPreference: "primary",
    readConcern: {level: "local"},
    writeConcern: {w: "majority"}
  };
  try {
    await session.withTransaction(async () => {
      // Remove user posts
      await Post.deleteMany({user: req.user.id}, {session});
      // Remove profile
      await Profile.deleteOne({user: req.user.id}, {session});
      // Remove user
      await User.deleteOne({_id: req.user.id}, {session});

    }, transactionOptions);

    res.json({msg: "User deleted"});

  } catch (e) {
    console.log("The transaction was aborted due to an unexpected error: " + e);
    res.status(500).send("Server Error");
  } finally {
    await session.endSession();
  }
});


// @route    PUT api/profile
// @desc     Update profile avatar
// @access   Private
router.put(
  "/avatar",
  [auth, [check("avatar", "Avatar is required").not().isEmpty()]],
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
    try {
      await session.withTransaction(async () => {
        const profile = await Profile.findOneAndUpdate(
          {user: req.user.id},
          {$set: {"avatar": req.body.avatar}},
          {new: true, lean: true, session});

        await Post.updateMany(
          {user: req.user.id},
          {$set: {"avatar": req.body.avatar}},
          {session});

        await Comment.updateMany(
          {user: req.user.id},
          {$set: {"avatar": req.body.avatar}},
          {session});

        res.json(profile);

        clearCache(`profile:${req.user.id}`);

      }, transactionOptions);

    } catch (e) {
      console.log("The transaction was aborted due to an unexpected error: " + e);
      res.status(500).send("Server Error");
    } finally {
      await session.endSession();
    }
  }
);

// @route    PUT api/profile/intro
// @desc     Edit profile intro
// @access   Private
router.put(
  "/intro",
  [auth, [check("status", "Status is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    try {
      const profile = await Profile.findOneAndUpdate(
        {user: req.user.id},
        {$set: {"status": req.body.status, "location": req.body.location}},
        {new: true}).lean();

      res.json(profile);

      clearCache(`profile:${req.user.id}`);

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);


// @route    PUT api/profile/about
// @desc     Edit profile about
// @access   Private
router.put(
  "/about",
  auth,
  async (req, res) => {
    try {
      const profile = await Profile.findOneAndUpdate(
        {user: req.user.id},
        {$set: {"about": req.body.about}},
        {new: true}).lean();

      res.json(profile);

      clearCache(`profile:${req.user.id}`);

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);


// @route    PUT api/profile/githubusername
// @desc     Edit profile githubusername
// @access   Private
router.put(
  "/githubusername",
  auth,
  async (req, res) => {
    try {
      const profile = await Profile.findOneAndUpdate(
        {user: req.user.id},
        {$set: {"githubusername": req.body.githubusername}},
        {new: true}).lean();

      res.json(profile);

      clearCache(`profile:${req.user.id}`);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is required and needs to be from the past")
        .not()
        .isEmpty()
        .custom((value, {req}) => (req.body.to ? value < req.body.to : true))
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOneAndUpdate(
        {user: req.user.id},
        {$push: {experience: newExp}},
        {new: true}).lean();

      res.json(profile);

      clearCache(`profile:${req.user.id}`);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);


// @route    PUT api/profile/experience/:exp_id
// @desc     Edit experience item from profile
// @access   Private

router.put("/experience/:exp_id",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is required and needs to be from the past")
        .not()
        .isEmpty()
        .custom((value, {req}) => (req.body.to ? value < req.body.to : true))
    ]
  ],
  async (req, res) => {
    try {
      const foundProfile = await Profile.findOneAndUpdate({
          user: req.user.id,
          "experience._id": req.params.exp_id
        },
        {
          $set: {
            "experience.$.title": req.body.title,
            "experience.$.company": req.body.company,
            "experience.$.location": req.body.location,
            "experience.$.from": req.body.from,
            "experience.$.to": req.body.to,
            "experience.$.current": req.body.current,
            "experience.$.description": req.body.description
          }
        },
        {new: true}).lean();

      clearCache(`profile:${req.user.id}`);

      return res.status(200).json(foundProfile);
    } catch (error) {
      console.error(error);
      return res.status(500).json({msg: "Server error"});
    }
  });


// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOneAndUpdate({user: req.user.id},
      {$pull: {experience: {_id: req.params.exp_id}}},
      {new: true}).lean();

    clearCache(`profile:${req.user.id}`);

    return res.status(200).json(foundProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({msg: "Server error"});
  }
});

// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldofstudy", "Field of study is required").not().isEmpty(),
      check("from", "From date is required and needs to be from the past")
        .not()
        .isEmpty()
        .custom((value, {req}) => (req.body.to ? value < req.body.to : true))
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOneAndUpdate(
        {user: req.user.id},
        {$push: {education: newEdu}},
        {new: true}).lean();

      res.json(profile);

      clearCache(`profile:${req.user.id}`);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);


// @route    PUT api/profile/education/:edu_id
// @desc     Edit education item from profile
// @access   Private

router.put("/education/:edu_id",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldofstudy", "Field of study is required").not().isEmpty(),
      check("from", "From date is required and needs to be from the past")
        .not()
        .isEmpty()
        .custom((value, {req}) => (req.body.to ? value < req.body.to : true))
    ]
  ],
  async (req, res) => {
    try {
      const foundProfile = await Profile.findOneAndUpdate({user: req.user.id, "education._id": req.params.edu_id},
        {
          $set: {
            "education.$.school": req.body.school,
            "education.$.degree": req.body.degree,
            "education.$.fieldofstudy": req.body.fieldofstudy,
            "education.$.from": req.body.from,
            "education.$.to": req.body.to,
            "education.$.current": req.body.current,
            "education.$.description": req.body.description
          }
        },
        {new: true}).lean();

      clearCache(`profile:${req.user.id}`);

      return res.status(200).json(foundProfile);
    } catch (error) {
      console.error(error);
      return res.status(500).json({msg: "Server error"});
    }
  });


// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOneAndUpdate({user: req.user.id},
      {$pull: {education: {_id: req.params.edu_id}}},
      {new: true}).lean();

    clearCache(`profile:${req.user.id}`);

    return res.status(200).json(foundProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({msg: "Server error"});
  }
});


// @route    PUT api/profile/skills
// @desc     Edit profile skills
// @access   Private
router.put(
  "/skills",
  auth,
  async (req, res) => {
    try {
      let skills = Array.isArray(req.body.skills) ?
        req.body.skills : req.body.skills.length === 0 ?
          [] : req.body.skills.split(",").map((skill) => skill.trim());

      const profile = await Profile.findOneAndUpdate(
        {user: req.user.id},
        {$set: {skills: skills}},
        {new: true}).lean();

      res.json(profile);
      clearCache("profile:" + req.user.id);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);


// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Private
router.get("/github/:username", auth, async (req, res) => {
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?sort=created:asc`
    );
    const headers = {
      "user-agent": "node.js",
      Authorization: `token ${config.get("githubToken")}`
    };

    const gitHubResponse = await axios.get(uri, {headers});
    res.json(gitHubResponse.data);
  } catch (err) {
    console.error(err.message);
    return res.status(404).json({msg: "No Github profile found"});
  }
});


// @route    PUT api/profile/view
// @desc     Add this user to target's view
// @access   Private
router.put(
  "/view",
  auth,
  async (req, res) => {
    try {
      const targetProfile = await Profile.findOneAndUpdate({user: req.body.user},
        {$push: {views: {"user": req.user.id}}},
        {new: true, lean: true});
      // accept a delay in view count

      res.json(targetProfile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);


// @route    PUT api/profile/follow
// @desc     Add target to this user's following and add this user to target's followers
// @access   Private
router.put(
  "/follow",
  auth,
  async (req, res) => {
    // start a transaction
    const session = await mongoose.connection.startSession();
    const transactionOptions = {
      readPreference: "primary",
      readConcern: {level: "local"},
      writeConcern: {w: "majority"}
    };
    try {
      await session.withTransaction(async () => {
        await Profile.updateOne(
          {user: req.user.id},
          {$push: {following: {"user": req.body.user}}},
          {session});

        const targetProfile = await Profile.findOneAndUpdate(
          {user: req.body.user},
          {$push: {followers: {"user": req.user.id}}},
          {new: true, lean: true, session});

        res.json(targetProfile);

        clearCache(`postIdsOfFollowing:${req.user.id}`);
        clearCache(`profile:${req.user.id}`);
        clearCache(`profile:${req.body.user}`);

      }, transactionOptions);

    } catch (e) {
      console.log("The transaction was aborted due to an unexpected error: " + e);
      res.status(500).send("Server Error");
    } finally {
      await session.endSession();
    }
  }
);


// @route    PUT api/profile/unfollow
// @desc     unfollow
// @access   Private

router.put(
  "/unfollow",
  auth,
  async (req, res) => {

    // start a transaction
    const session = await mongoose.connection.startSession();
    const transactionOptions = {
      readPreference: "primary",
      readConcern: {level: "local"},
      writeConcern: {w: "majority"}
    };
    try {
      await session.withTransaction(async () => {
        // remove target to this user's following and remove this user to target's followers
        await Profile.updateOne(
          {user: req.user.id},
          {$pull: {"following": {user: req.body.user}}},
          {session});

        const targetProfile = await Profile.findOneAndUpdate(
          {user: req.body.user},
          {$pull: {"followers": {user: req.user.id}}},
          {new: true, lean: true, session});

        res.json(targetProfile);

        clearCache(`postIdsOfFollowing:${req.user.id}`);
        clearCache(`profile:${req.user.id}`);
        clearCache(`profile:${req.body.user}`);

      }, transactionOptions);
    } catch (e) {
      console.log("The transaction was aborted due to an unexpected error: " + e);
      res.status(500).send("Server Error");
    } finally {
      await session.endSession();
    }
  }
);


// @route    PUT api/profile/connect
// @desc     Add target to this user's following, add this user to target's followers,
//           add this user to target's invitation received, and add target to this user's invitation sent
// @access   Private
router.put(
  "/connectAndReturnTargetProfile",
  auth,
  async (req, res) => {
    // start a transaction
    const session = await mongoose.connection.startSession();
    const transactionOptions = {
      readPreference: "primary",
      readConcern: {level: "local"},
      writeConcern: {w: "majority"}
    };
    try {
      await session.withTransaction(async () => {
        await Profile.updateOne(
          {user: req.user.id},
          {
            $push: {
              "following": {user: req.body.user},
              "invitationSent": {user: req.body.user}
            }
          },
          {session}
        );

        const targetProfile = await Profile.findOneAndUpdate(
          {user: req.body.user},
          {
            $push: {
              "followers": {user: req.user.id},
              "invitationReceived": {user: req.user.id}
            }
          },
          {new: true, lean: true, session}
        );

        res.json(targetProfile);

        clearCache(`postIdsOfFollowing:${req.user.id}`);
        clearCache(`profile:${req.user.id}`);
        clearCache(`profile:${req.body.user}`);

      }, transactionOptions);
    } catch (e) {
      console.log("The transaction was aborted due to an unexpected error: " + e);
      res.status(500).send("Server Error");
    } finally {
      await session.endSession();
    }
  }
);

// @route    PUT api/profile/connect
// @desc     Add target to this user's following, add this user to target's followers,
//           add this user to target's invitation received, and add target to this user's invitation sent
// @access   Private
router.put(
  "/connectAndReturnCurrProfile",
  auth,
  async (req, res) => {

    // start a transaction
    const session = await mongoose.connection.startSession();
    const transactionOptions = {
      readPreference: "primary",
      readConcern: {level: "local"},
      writeConcern: {w: "majority"}
    };
    try {
      await session.withTransaction(async () => {
        const currProfile = await Profile.findOneAndUpdate(
          {user: req.user.id},
          {
            $push: {
              "following": {user: req.body.user},
              "invitationSent": {user: req.body.user}
            }
          },
          {new: true, session}
        ).lean();

        await Profile.updateOne(
          {user: req.body.user},
          {
            $push: {
              "followers": {user: req.user.id},
              "invitationReceived": {user: req.user.id}
            }
          },
          {session}
        );

        res.json(currProfile);

        clearCache(`postIdsOfFollowing:${req.user.id}`);
        clearCache(`profile:${req.user.id}`);
        clearCache(`profile:${req.body.user}`);

      }, transactionOptions);
    } catch (e) {
      console.log("The transaction was aborted due to an unexpected error: " + e);
      res.status(500).send("Server Error");
    } finally {
      await session.endSession();
    }
  }
);


// @route    PUT api/profile/unconnect
// @desc     Remove target to this user's following, remove this user to target's followers,
//           remove both target and user from their connections
// @access   Private
router.put(
  "/unconnect",
  auth,
  async (req, res) => {
    // start a transaction
    const session = await mongoose.connection.startSession();
    const transactionOptions = {
      readPreference: "primary",
      readConcern: {level: "local"},
      writeConcern: {w: "majority"}
    };
    try {
      await session.withTransaction(async () => {
        await Profile.updateOne(
          {user: req.user.id},
          {$pull: {"following": {user: req.body.user}, "connections": {user: req.body.id}}},
          {session});
        const targetProfile = await Profile.findOneAndUpdate(
          {user: req.body.user},
          {$pull: {"followers": {user: req.user.id}, "connections": {user: req.user.id}}},
          {new: true, lean: true, session});

        res.json(targetProfile);

        clearCache(`postIdsOfFollowing:${req.user.id}`);
        clearCache(`profile:${req.user.id}`);
        clearCache(`profile:${req.body.user}`);

      }, transactionOptions);
    } catch (e) {
      console.log("The transaction was aborted due to an unexpected error: " + e);
      res.status(500).send("Server Error");
    } finally {
      await session.endSession();
    }
  }
);


// @route    PUT api/profile/accept
// @desc     Add target to this user's following, add this user to target's followers,
//           remove this user from target's invitation sent, and remove this user's invitation received
//           add this user to target's connections, and add target to this user's connections
// @access   Private
router.put(
  "/accept",
  auth,
  async (req, res) => {

    // start a transaction
    const session = await mongoose.connection.startSession();
    const transactionOptions = {
      readPreference: "primary",
      readConcern: {level: "local"},
      writeConcern: {w: "majority"}
    };

    try {
      await session.withTransaction(async () => {
        await Profile.updateOne(
          {user: req.user.id},
          {
            $push: {
              "following": {user: req.body.user},
              "connections": {user: req.body.user}
            }
          },
          {session}
        );
        const currProfile = await Profile.findOneAndUpdate(
          {user: req.user.id},
          {
            $pull: {
              "invitationReceived": {user: req.body.user}
            }
          },
          {new: true, lean: true, session}
        );
        await Profile.updateOne(
          {user: req.body.user},
          {
            $push: {
              "followers": {user: req.user.id},
              "connections": {user: req.user.id}
            }
          },
          {session}
        );
        await Profile.updateOne(
          {user: req.body.user},
          {
            $pull: {
              "invitationSent": {user: req.user.id}
            }
          },
          {session}
        );
        res.json(currProfile);

        clearCache(`postIdsOfFollowing:${req.user.id}`);
        clearCache(`profile:${req.user.id}`);
        clearCache(`profile:${req.body.user}`);

      }, transactionOptions);
    } catch (e) {
      console.log("The transaction was aborted due to an unexpected error: " + e);
      return res.status(500).send("Server Error");
    } finally {
      await session.endSession();
    }
  }
);


// @route    PUT api/profile/ignore
// @desc     Remove target from this user's invitation received list
// @access   Private
router.put(
  "/ignore",
  auth,
  async (req, res) => {
    // start a transaction
    const session = await mongoose.connection.startSession();
    const transactionOptions = {
      readPreference: "primary",
      readConcern: {level: "local"},
      writeConcern: {w: "majority"}
    };
    try {
      await session.withTransaction(async () => {
        await Profile.updateOne(
          {user: req.user.id},
          {$pull: {"invitationReceived": {user: req.body.user}}},
          {session});

        res.status(200).json({msg: "success"});
        clearCache(`profile:${req.user.id}`);

      }, transactionOptions);
    } catch (e) {
      console.log("The transaction was aborted due to an unexpected error: " + e);
      return res.status(500).send("Server Error");
    } finally {
      await session.endSession();
    }
  }
);

module.exports = router;
