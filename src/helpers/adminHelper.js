import generateJwt from "../services/jwt"; //importing function to generate JWT Token
import bcrypt from "bcrypt";  //importing bcrypt

//importing models
import { Admin } from "../models/adminModel";
import { User } from "../models/userModel";




// @desc    Login admin
// @route   POST /admin/login
// @access  Private
export const adminLogin = (data) => {
  try {
    return new Promise(async (resolve, reject) => {
      const admin = await Admin.findOne({ email: data.email });
      if (
        data.email === admin?.email &&
        bcrypt.compare(data.password, admin.password)
      ) {
        generateJwt(admin)
          .then((adminToken) => {
            console.log(adminToken);
            resolve({
              status: 200,
              message: "Admin login successful",
              adminToken,
              admin,
              valid: true
            });
          })
          .catch((error) => {
            console.log(error);
            resolve({
              status: 500,
              message: error.message,
              error_code: "INTERNAL_SERVER_ERROR",
            });
          });
      } else {
        resolve({ status: 401, message: "Invalid credentials" });
      }
    });
  } catch (error) {
    console.log("error during admin login (in adminHelper): " + error);
  }
};

// @desc    Fetch users
// @access  Admins
export const toggelBlockStatus = (userId, status) => {
  return new Promise((resolve, reject) => {
    try {
      User.findOneAndUpdate({ _id: userId }, { blocked: status }, { new: true })
        .select("-password")
        .exec()
        .then((response) => {
          resolve({
            status: 200,
            message: "User block status updated",
            user: response,
          });
        })
        .catch((err) => {
          resolve({
            status: 500,
            error_code: "DB_UPDATE_ERROR",
            message: err.message,
          });
        });
    } catch (error) {
      resolve({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      });
    }
  });
};
