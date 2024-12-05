import jwt from "jsonwebtoken";
import { User } from "../Model/User.Model.js";

// Validator Middleware
const validator = async (req, res, next) => {
  try {
    // Log incoming cookies
    // Retrieve the token from cookies or the Authorization header
    const cookie = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  

    if (!cookie) {
      return res.status(403).json({
        status: "Unauthorized Access",
        message: "Access token is missing or invalid.",
      });
    }

    // Verify the token using JWT
    const decoded = jwt.verify(cookie, process.env.SECRET_KEY);

    // Fetch the user from the database (excluding the password field)
    const user = await User.findOne({ _id: decoded.id }).select("-password");

    if (!user) {
      return res.status(404).json({
        status: "Bad Request",
        message: "User not found.",
      });
    }

    // Attach user data to the request object for use in subsequent middleware/routes
    req.user = user;

    // Move to the next middleware/route handler
    next();
  } catch (error) {
    console.error("Error in Validator Middleware:", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error. Unable to validate access token.",
    });
  }
};

export default validator;



