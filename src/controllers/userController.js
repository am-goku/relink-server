import { json, response } from "express";

//importing Helpers
import { getUsers, registration, userLogin, verifyEmail, verifyEmailToken } from "../helpers/userHelper.js";


// @desc    Login user
// @route   POST /user/login
// @access  Public
export const login = (req, res, next) => {
  try {
    const userData = req.body;
    userLogin(userData).then((data) => {
      res.status(200).json(data);
    }).catch((err) => {
      console.log("Error while getting userLogin", err);
    })
  } catch (error) {
    console.log("Error while login", error);
  }
}


// @desc    Get username & email
// @route   GET /user/userdetails
// @access  Public
export const getUserdetails = (req, res) => {
  try {
    getUsers({})
      .then((response) => {
        const usernames = [], emails = [], users = response.users;
        users.forEach((user) => {
          usernames.push(user.username);
          emails.push(user.email);
        });
        res.status(response.status).send({status: response.status, message: response.message, usernames, emails});
      })
      .catch((err) => {
        console.log("error in calling getUsers", err);
        response.status(200).json({status:500, message:"Sometings wrong", error_code: "INTERNAL_SERVER_ERROR"})
      });
  } catch (error) {
    console.log("error in getUsername", error);
  }
};


// @desc    Register user data
// @route   POST /user/register
// @access  Public
export const registerUser = (req, res) => {
  try {
    const userData = req.body;
    console.log(userData);
    registration(userData)
      .then((response) => {
        res.status(200).json({...response})
      })
      .catch((err) => {
        console.log("error in registerUser", err);
      });
  } catch (error) {
    console.log("Error in registerUser (userController)", error);
  }
};


// @desc    Get users
// @route   GET /user/fetch-users
// @access  Public
export const fetchUsers = (req, res) => {
  try {
    let query = {};
    if(req.query?.userId){
      query = {_id: req.query.userId}
    }
    getUsers(query).then((response) => {
      res.status(200).json({...response})
    }).catch((err) => {
      res.status(200).json({status:500, message: 'Somethings wrong', error_code: "INTERNAL_SERVER_ERROR"});
    })

  } catch (error) {
    console.log("error in fetchUsers (userController)", error);
  }
};






// @desc    To send user verification email
// @route   GET /user/fetch-users
// @access  Public
export const sentVerificationEmail = (req, res) => {
  try {
    const email = req.body.email;
    verifyEmail(email).then((response) => {
      res.status(200).send(response)
    }).catch((error) => {
      res.status(error.status).send(error)
    })
  } catch (error) {
    res.status(500).send({
      status: 500,
      error_code: "INTERNAL_SERVER_ERROR",
      message: "Somethings wrong please try after sometime.",
    });
  }
};


// @desc    Verify otpToken
// @route   GET /user/fetch-users
// @access  Public
export const verifyOTP = (req, res, next) => {
  try {
    const {email, otpToken} = req.body;
    verifyEmailToken(email, otpToken).then((response)=> {
      res.status(200).send(response);
    }).catch((error)=> {
      res.status(error.status).send(error);
    })
  } catch (error) {
    res.status(500).send(error)
  }
}
