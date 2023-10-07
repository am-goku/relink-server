import jwt from "jsonwebtoken"; //importing jwt from jsonwebtoken

//importing models
import { Admin } from "../models/adminModel";


// @desc    Admin authentication
// @route   < Middleware >
// @access  Private
const protectAdmin = async (req, res, next) => {
  let adminToken;
  if (req.headers.authorization) {
    try {
      adminToken = req.headers.authorization;
      const decoded = jwt.verify(adminToken, process.env.JWT_KEY_SECRET);

      Admin.findOne({ _id: decoded.userId })
        .select("-password")
        .then((admin) => {
          if (admin) {
            req.admin = admin;
            console.log("this is the admin",req.admin);
            next();
          } else {
            // User not found
            res.status(200).json({
              message: "User not authorized",
              status: 401,
              error_code: "AUTHENTICATION_FAILED",
            });
          }
        })
        .catch((err) => {
          // Handle database errors
          console.error(error);
          res.status(200).json({
            message: "Internal Server Error",
            status: 500,
            error_code: "INTERNAL_SERVER_ERROR",
          });
        });
    } catch (error) {
      // Token verification failed
      console.error(error);
      res.status(200).json({
        message: "User not authorized",
        status: 401,
        error_code: "AUTHENTICATION_FAILED",
      });
    }
  } else {
    // No token provided
    res.status(200).json({
      status: 401,
      message: "No token provided",
      error_code: "NO_TOKEN",
    });
  }
};


export default protectAdmin
