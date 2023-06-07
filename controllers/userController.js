import { emailRegistry, emailRecoverPass } from "../helpers/emails.js";
import generateJwt from "../helpers/generateJwt.js";
import generateSecureToken from "../helpers/generateSecureToken.js";
import User from "../models/User.js";

const createUser = async (req, res) => {
  //prevent duplicate users
  const { email } = req.body;
  const userExist = await User.findOne({ email: email });
  if (userExist) {
    return res.json({ msg: "User already registered.", error:true });
  }

  try {
    const user = new User(req.body);
    user.token = generateSecureToken();
    await user.save();

    //sending confirmation email..
    emailRegistry({
      email: user.email,
      name: user.name,
      token: user.token
    });

    res.json({msg:"User created succesfully, review your email to confirm your account."});
  } catch (error) {
    console.log(error);
    return res.json({msg:error.message, error:true});
  }
};

const authenticateUser = async (req, res) => {
  const { email, password } = req.body;
  //verify user exists..
  const userExist = await User.findOne({ email: email });
  if (!userExist) {
    return res.json({ msg: "User not registered.", error:true });
  }
  //verify if the user is cofirmed
  if (!userExist.confirmed) {
    return res
      .json({
        msg: "Your account is not confirmed, please confirm your account.", error:true
      });
  }

  //verifiy password
  if (await userExist.verifyPassword(password)) {
    res.status(200).json({
      _id: userExist._id,
      name: userExist.name,
      email: userExist.email,
      token: generateJwt(userExist._id),
    });
  } else {
    return res
      .json({ msg: "Invalid credentials, verify your username and password", error:true });
  }
};

const confirmToken = async function (req, res) {
  const { token } = req.params;
  const userExist = await User.findOne({ token });
  if (!userExist) {
    return res.json({ msg: "Invalid token.", error:true });
  }

  try {
    userExist.confirmed = true;
    userExist.token = "";
    await userExist.save();
    res.json({ msg: "User confirmed correctly." });
  } catch (error) {
    console.log(error);
    return res.json({msg:error.message, error:true});
  }
};

const recoverPassword = async function (req, res) {
  const { email } = req.body;
  const userExist = await User.findOne({ email });
  if (!userExist) {
    return res.json({ msg: "User not registered.", error:true });
  }

  try {
    userExist.token = generateSecureToken();
    await userExist.save();

    //send email
    emailRecoverPass({
      email: userExist.email,
      name: userExist.name,
      token: userExist.token
    });

    res.json({
        msg: "We send you an email with the instructions to recover your password!",
      });
  } catch (error) {
    console.log(error);
    return res.json({msg:error.message, error:true});
  }
};

const validateToken = async function (req, res) {
  const { token } = req.params;
  const tokenValido = await User.findOne({ token });
  if (tokenValido) {
    res.json({ msg: "Token is valid!" });
  } else {
    return res.json({ msg: "Token is NOT valid!", error:true });
  }
};

const newPassword = async function (req, res) {
  const { token } = req.params;
  const { password } = req.body;
  const user = await User.findOne({ token });
  if (user) {
    try {
      user.password = password;
      user.token = "";
      await user.save();
      res.json({ msg: "Password modified correctly!" });
    } catch (error) {
      res.json({ msg: error.message });
    }
  } else {
    return res.json({ msg: "Token is NOT valid!", error:true });
  }
};

const profile = async function (req, res) {
    res.json(req.user);
};

export {
  createUser,
  authenticateUser,
  confirmToken,
  recoverPassword,
  validateToken,
  newPassword,
  profile,
};
