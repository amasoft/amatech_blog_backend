import Router from "express";
import authoController from "../Controllers/AuthorController.js";
// import {
//   UserExist,
//   EmailExist,
//   isresetCodevalid,
//   isEmailverified,
// } from "../middlewares/authmiddleware.js";
import {
  AuthorExist,
  usernameExist,
  validateInput,
  validateLoginInput,
} from "../middlewares/authmiddleware.js";
const authorRouter = Router();
authorRouter.post(
  "/signup",
  [validateInput],
  [AuthorExist],
  [usernameExist],
  authoController.signup
);
authorRouter.post("/login", [validateLoginInput], authoController.login);
authorRouter.get("/verifyemail/:verifycode", authoController.verifyEmail);
// router.post("/signup", [UserExist], authentication.signup);
// router.post("/isemailverified", [isEmailverified], authentication.getProfiles);
// router.post("/restcode", [EmailExist], authentication.sendRestpassword); //send code to user for password  rest
// router.get(
//   "/forgotpassword/:token",
//   [isresetCodevalid],
//   authentication.forgotPassword
// );
// //check password strength

export default authorRouter;
