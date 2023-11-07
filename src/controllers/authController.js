// @desc    Returns user
// @route   GET /auth/user

import { response } from "express";
import { changePasswordHelper } from "../helpers/authHelper";

// @access  Private
export const authUser = (req, res) => {
  try {
    const user = req.user;
    res
      .status(200)
      .json({
        status: 200,
        message: "User is authenticated",
        valid: true,
        user,
      });
  } catch (err) {
    res
      .status(200)
      .json({
        status: 500,
        message: "Somethings is wrong",
        error_code: "INTERNAL_SERVER_ERROR",
      });
  }
};


// @desc    Returns admin after Auth
// @route   GET /auth/admin
// @access  Private
export const authAdmin = (req, res) => {
  try {
    const admin = req.admin;
    res
      .status(200)
      .json({
        status: 200,
        message: "Admin is authenticated",
        valid: true,
        admin,
      });
  } catch (error) {
    res
      .status(200)
      .json({
        status: 500,
        message: "Somethings failed",
        error_code: "INTERNAL_SERVER_ERROR",
      });
  }
};




///// change password

export const changePassword = (req, res) => {
  try {
    const {token, username} = req.params;

    changePasswordHelper(token, username).then((response)=> {
      res.status(200).send("password has been changed successfully, Please go back to home page.");
    }).catch((error)=> {
      res.status(500).send(error.message)
    })
  } catch (error) {
    res.status(500).send(error.message);
  }
}
