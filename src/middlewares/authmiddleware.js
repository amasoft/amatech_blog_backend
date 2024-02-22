import Author from "../Models/Authors.js";
import Joi from "joi";

export const AuthorExist = async (req, res, next) => {
  const authorExist = await Author.findOne({ email: req.body.email });
  if (authorExist) {
    return res.json({
      status: 409,
      message: "author Already exist",
    });
  }
  next();
};
export const usernameExist = async (req, res, next) => {
  const usernameExist = await Author.findOne({ username: req.body.username });
  if (usernameExist) {
    return res.json({
      status: 409,
      message: "username Already exist",
    });
  }
  next();
};
export const isresetCodevalid = async (req, res, next) => {
  console.log("params >>>" + req.params.token);
  const currentDate = new Date();
  const code = await req.params.token;
  const checkCode = await User.findOne({
    code: code,
  });
  if (!checkCode) {
    return res.status(409).json({ message: "Reset code  is invalid" });
  }
  const db = new Date(checkCode.expiresTime);

  if (db && currentDate < db) {
    console.log("message>>code is valid");
    req.email = checkCode.email;
    next();
  } else {
    console.log("message>>code has expired");
    return res.status(409).json({ message: "Code has Expired" });
  }
};

export const validateInput = async (req, res, next) => {
  const schema = Joi.object({
    lastName: Joi.string().alphanum().required().messages({
      "string.required": "lastname cannot be empty",
      "string.alphanum": "lastname  must only contain alphanumeric characters",
    }),
    firstName: Joi.string().required(),
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().min(8).max(12).required(),
    phoneNumber: Joi.string()
      // .pattern(/^\+[0-9]{13}$/)
      .required()
      .messages({
        "string.pattern.base":
          "mobile number must be alphanumeric with no special characters",
        "any.required": "Password is required",
      }),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  req.value = value;
  next();
};
export const validateLoginInput = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(8).max(12).required(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  req.value = value;
  next();
};
