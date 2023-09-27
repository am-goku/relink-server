//importing Helpers
import { getUsers, registration, userLogin } from "../helpers/userHelper.js";
import { json, response } from "express";






export const login = (req, res, next) => {
  try {
    const userData = req.body;
    userLogin(userData).then((data) => {
      if(data?.status === 200){
        console.log(data);
        res.status(200).json(data)
      } else {
        res.status(data.status).json(data);
      }
    }).catch((err) => {
      console.log("Error while getting userLogin", err);
    })
  } catch (error) {
    console.log("Error while login", error);
  }
}


//This function is used to get the usernames and emails of existing user as an array from a
//helper function getUser which returns the details of all users in the server.
export const getUserdetails = (req, res) => {
  try {
    getUsers()
      .then((users) => {
        const usernames = [], emails = [];
        users.forEach((user) => {
          usernames.push(user.username);
          emails.push(user.email);
        });
        res.status(200).send({usernames, emails});
      })
      .catch((err) => {
        console.log("error in calling getUsers", err);
      });
  } catch (error) {
    console.log("error in getUsername", error);
  }
};




export const registerUser = (req, res) => {
  try {
    const userData = req.body;
    console.log(userData);
    registration(userData)
      .then((response) => {
        res.status(200).send({ message: "registration successful", response });
      })
      .catch((err) => {
        console.log("error in registerUser", err);
      });
  } catch (error) {
    console.log("Error in registerUser (userController)", error);
  }
};
