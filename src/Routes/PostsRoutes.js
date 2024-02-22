import Router from "express";
import postcontroller from "../Controllers/PostsController.js";
const postRouter = Router();
postRouter.post("/", postcontroller.createPost);
export default postRouter;
