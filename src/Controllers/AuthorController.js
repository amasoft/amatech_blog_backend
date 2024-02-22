import Postmodel from "../Models/Authors.js";
import Author from "../Models/Authors.js";
import { createToken, sendSMS, sendMail } from "../util/Emailhelpers.js";
import bcrypt from "bcrypt";
import { display } from "../util/display.js";
// const { sendmail, emailverified } = require("../util/sendmail");

// const handleErrors = (err) => {
//   // console.log("handleErrors", err);

//   let errors = { email: "", password: "" };
//   //incoreet email
//   if (err.message === "incorrect Email") {
//     errors.email = "email not registered ";
//   }
//   //incoreet password
//   if (err.message === "incorrect Password") {
//     errors.password = "password is incorrect ";
//   }
//   //duplivcate error code
//   if (err.code === 11000) {
//     errors.email = " Email  already registerd";
//     // return errors;
//   }
//   //validat
//   if (err.message.includes("user validation failed")) {
//     Object.values(err.errors).forEach(({ properties }) => {
//       errors[properties.path] = properties.message;
//       console.log("888888", properties);
//     });
//     // console.log(err);
//   }
//   console.log("error ", JSON.stringify(errors));
//   Object.entries(errors).forEach(([key, value]) => {
//     if (value === null || value === undefined || value === "") {
//       delete errors[key];
//     } else if (typeof value === "object" && !Array.isArray(value)) {
//       // Recursively remove empty keys in nested objects
//       removeEmptyKeys(value);

//       // If the nested object becomes empty after removal, delete the key
//       if (Object.keys(value).length === 0) {
//         delete errors[key];
//       }
//     }
//   });
//   return errors;
// };
// const maxAge = 3 * 24 * 60 * 60;
export default class authoController {
  static async signup(req, res) {
    console.log("welcom sir");
    const verifycode = Math.floor(Math.random() * 90000) + 10000;
    const verifyLink = `localhost:3000/api/v1/verifyemail/${verifycode}`;
    req.value.code = verifycode;
    try {
      const author = await Author.create(req.value);
      if (!author)
        return res.status(409).json({
          message: "Registration not Succesfull!",
        });
      // const sendCode = sendSMS(user.phoneNumber, verifycode);
      var message = `Dear ${author.firstName} ${author.lastName} welcome, klndly verify Your Account using this Passcode`;
      const sendCode = sendMail(verifyLink, author.email, message);

      console.log("sendCode");
      console.log(sendCode);
      if (!sendCode)
        return res.status(409).json({
          message: "error sending SMS!",
          error: sendCode,
        });
      // const token = createToken(author._id);
      res.status(201).json({
        author: author._id,
        // token,
        message: "Registration Succesfull Proceed to verify your Email",
      });
    } catch (err) {
      // const errors = handleErrors(err);
      console.log("arinze", err);
      console.log("faith", JSON.stringify(err));
      return res.status(400).json({ errors: err.message });
    }
  }

  static async verifyEmail(req, res) {
    const code = req.params.verifycode;
    console.log(code);
    const checkCode = await Author.findOne({
      code: code,
    });
    if (checkCode && checkCode.verified) {
      return res.status(401).json({
        message: "Email already verfied!",
      });
    }
    if (!checkCode) {
      console.log("checkCode", checkCode);

      return res.status(401).json({
        message: "Incorrect code!",
      });
    }
    console.log("checkCode id", checkCode._id);

    Author.updateOne(
      { code: code },
      { $set: { verified: true, code: "undefined" } }
    )
      .then((result) => {
        return res.status(200).json({
          message: "Email verified",
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  static async login(req, res) {
    const { email, password } = req.body;
    const author = await Author.findOne({ email });
    //check if email is verifed
    if (author && !author.verified) {
      return res.status(400).json({
        message: "please verify your Email",
      });
    }
    if (author && (await bcrypt.compare(password, author.password))) {
      const token = createToken(author._id);
      return res
        .status(200)
        .json({ token: token, message: "Login  Succesfull" });
    }
    return res.status(401).json({ message: "incorrect email/password" });
  }

  static async forgotPassword(req, res) {
    console.log("welcoime");
    //check if confirm and password are same
    const isPasswordsame = await User.hasPassword(
      req.body.password,
      req.body.confirm
    );
    //check if paasword is correct
    User.updateOne(
      { email: req.email },
      { $set: { password: isPasswordsame, code: "undefined" } }
    )
      .then((result) => {
        return res.status(200).json({
          message: "password  updated succesfully ",
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  static async sendRestpassword(req, res) {
    try {
      const userEmail = req.body.email;
      const generateCode = Math.floor(Math.random() * 30000) + 10000;
      var token = `localhost:3000/api/v1/forgotpassword/${generateCode}`;
      const duration = Date.now();
      const tenMinutesnow = new Date(duration);
      tenMinutesnow.setMinutes(tenMinutesnow.getMinutes() + 10);
      console.log("duration>>  " + tenMinutesnow);

      User.updateOne(
        { email: userEmail },
        { $set: { code: generateCode, expiresTime: tenMinutesnow } }
      )
        .then((result) => {
          const sendmail = sendMail(token, userEmail);
          if (sendMail) {
            return res.status(200).json({
              message:
                "Account reset Code sent to Email,Please check your inbox! ",
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      return res.status(500).json({
        message: "erro occured " + error,
      });
    }
  }
  static async getProfiles(req, res) {
    const projection = {
      _id: 0,
      email: 1,
      lastName: 1,
    };
    console.log("from getprofiles");
    const { email } = req.body;
    try {
      const result = await User.findOne({ email: email }).select(projection);
      if (result) {
        return res
          .status(200)
          .json({ data: result, message: "user data succesfully returned" });
      }
    } catch (error) {
      return res.status(200).json({ message: "erro getting data" });
    }
  }
}
