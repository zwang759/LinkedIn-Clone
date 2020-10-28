const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    index: true
  },
  text: {
    type: String
  },
  src: {
    url: {
      type: String
    },
    type: {
      type: String
    }
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  status: {
    type: String
  },
  likes: [
    {
      type: Schema.Types.ObjectId
    }
  ],
  numOfComments: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

PostSchema.index({"text": "text"});

module.exports = mongoose.model("post", PostSchema);
