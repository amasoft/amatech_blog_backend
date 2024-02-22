import Router from "express";
import { app } from "../../config/Connection.js";
import authorRouter from "./AuthorsRoutes.js";
import postRouter from "./PostsRoutes.js";
const router = Router();

router.use("/author", authorRouter);
router.use("/post", postRouter);
export default router;
