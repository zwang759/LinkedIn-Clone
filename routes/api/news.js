const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const config = require("config");
const NEWS_API_KEY = config.get("NEWS_API_KEY");
const axios = require('axios');

// @route    GET api/news
// @desc     Get top 10 tech news through news api
// @access   Private
router.get("/", auth, async (req, res) => {
  try {
    const news = await axios.get(NEWS_API_KEY);

    res.json(news.data.articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;