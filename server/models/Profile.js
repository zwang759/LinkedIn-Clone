const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const config = require("config");
const defaultAvatar = config.get("defaultAvatar");
const defaultBackgroundMedia = config.get("defaultBackgroundMedia");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    index: true
  },
  name: {
    type: String
  },
  avatar: {
    type: String,
    default: defaultAvatar
  },
  backgroundMedia: {
    type: String,
    default: defaultBackgroundMedia
  },
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  skills: {
    type: [String]
  },
  about: {
    type: String
  },
  githubusername: {
    type: String
  },
  experience: [
    {
      title: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      location: {
        type: String
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  education: [
    {
      school: {
        type: String,
        required: true
      },
      degree: {
        type: String,
        required: true
      },
      fieldofstudy: {
        type: String,
        required: true
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  numOfPosts: {
    type: Number,
    default: 0
  },
  followers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        index: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  following: [
    {
      user: {
        type: Schema.Types.ObjectId,
        index: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  connections: [
    {
      user: {
        type: Schema.Types.ObjectId,
        index: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  invitationSent: [
    {
      user: {
        type: Schema.Types.ObjectId
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  invitationReceived: [
    {
      user: {
        type: Schema.Types.ObjectId
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  views: [
    {
      user: {
        type: Schema.Types.ObjectId
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

ProfileSchema.index({
  "name": "text",
  "location": "text",
  "status": "text",
  "skills": "text",
  "about": "text",
  "education.school": "text",
  "education.fieldofstudy": "text",
  "experience.title": "text",
  "experience.company": "text"
});

module.exports = mongoose.model("profile", ProfileSchema);
