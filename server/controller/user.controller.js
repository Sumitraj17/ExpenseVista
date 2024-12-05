import { User } from "../Model/User.Model.js";
import { hashPassword, comparePassword } from "../utility/password.hash.js";
import jwt from "jsonwebtoken";

const userSignup = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    return res.status(404).json({ message: "Fill all the details" });
  }
  const user = await User.findOne({
    $or: [{ email }],
  });
  if (user) {
    return res
      .status(404)
      .json({ status: "Bad Request", message: "Email already exits" });
  }
  try {
    const hashed = await hashPassword(password);
    const Newuser = await new User({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashed,
    });

    await Newuser.save();

    return res.status(200).json({
      status: "Successful",
      message: "User Signup Successful",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "Failure", message: "Internal Server Error" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(404)
        .json({ status: "Bad Request", message: "Fill all the details" });
    }

    const isUser = await User.findOne({ email });

    if (!isUser) {
      return res
        .status(404)
        .json({ status: "Bad Request", message: "User Does not exists" });
    }

    const compare = await comparePassword(isUser.password, password);

    if (!compare) {
      return res
        .status(404)
        .json({ status: "Invalid Access", message: "Invalid Password" });
    }

    const JWT_KEY = process.env.SECRET_KEY;

    const token = await  jwt.sign({id: isUser._id }, JWT_KEY, { expiresIn: "7d" });
    const user = await User.findOne(isUser._id).select("-password")
    res.cookie("accessToken",token,{httpOnly:true,sameSite: "None",secure:true});
    return res
      .status(200)
      .json({
        status: "Success",
        message: "User login Successfull",
        user: user,
        token
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        status: "Internal Server Error",
        message: "Something went wrong",
      });
  }
};


export { userLogin, userSignup };
