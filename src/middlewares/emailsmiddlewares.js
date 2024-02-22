export const EmailExist = async (req, res, next) => {
  const userExist = await User.findOne({ email: req.body.email });
  if (userExist) {
    next();
    return;
  }
  return res.status(200).json({
    message: "No account with this email",
  });
};
export const isEmailverified = async (req, res, next) => {
  const result = await User.findOne({ email: req.body.email });
  if (result && result.verified) {
    next();
    return;
  }
  return res.status(200).json({
    message: "please verify your Email",
  });
};
