const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    index: true
  },
  postId: {
    type: Schema.Types.ObjectId,
    index: true
  },
  replyToId: {
    type: Schema.Types.ObjectId
  },
  replyToName: {
    type: String
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("comment", CommentSchema);