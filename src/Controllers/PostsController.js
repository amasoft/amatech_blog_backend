import Posts from "../Models/Posts.js";
import { display } from "../util/display.js";

export default class postcontroller {
  static async createPost(req, res) {
    display("post", "data");
    try {
      const post = await Posts.create(req.body);
      if (!post)
        return res.status(409).json({
          message: "Error creating Post",
        });

      res.status(201).json({
        message: "Post Created  Succesfull!",
      });
    } catch (err) {
      // const errors = handleErrors(err);

      return res.status(400).json({ errors: err.message });
    }
  }
}
