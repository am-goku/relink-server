//importing Helpers
import { getUsers, registration, userLogin } from "../helpers/userHelper.js";
import { json, response } from "express";





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


//This function is used to get the usernames and emails of existing user as an array from a
//helper function getUser which returns the details of all users in the server.
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
    if(req.query.userId){
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
}
