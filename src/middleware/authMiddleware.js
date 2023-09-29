import jwt from "jsonwebtoken";
import { User } from "../models/userModel";

const auth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_KEY_SECRET);
      User.findOne({ _id: decoded.userId })
      .select("-password")
        .then((user) => {
          if (user) {
            req.user = user;
            next();
          } else {
            // User not found
            res.status(401).json({
              message: "User not authorized",
              status: 401,
              error_code: "AUTHENTICATION_FAILED",
            });
          }
        })
        .catch((error) => {
          // Handle database errors
          console.error(error);
          res.status(500).json({
            message: "Internal Server Error",
            status: 500,
            error_code: "INTERNAL_SERVER_ERROR",
          });
        });
    } catch (e) {
      // Token verification failed
      console.error(e);
      res.status(401).json({
        message: "User not authorized",
        status: 401,
        error_code: "AUTHENTICATION_FAILED",
      });
    }
  } else {
    // No token provided
    res.status(401).json({
      status: 401,
      message: "No token provided",
      error_code: "NO_TOKEN",
    });
  }
};

export default auth;
