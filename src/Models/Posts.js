import mongoose from "mongoose";
import bcrypt from "bcrypt";
const postSchema = mongoose.Schema({
  titel: {
    type: String,
  },
  content: {
    type: String,
  },
  post_picture: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Authors",
  },
  category: {
    type: String,
  },
});

const Post = mongoose.model("post", postSchema);
export default Post;
