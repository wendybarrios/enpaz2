const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  mood: {
    type: String,
    required: true,
  },
  behaviors: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  // reference to the user model
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// MongoDB collection named here - will give lowercase plural of name
module.exports = mongoose.model("Post", PostSchema);
