import bcrypt, { hash } from 'bcrypt';
const saltRounds = 10;

import generateJwt from '../services/jwt.js';

//importing models
import {User} from "../models/userModel.js"; //userModel





export const userLogin = ({username, email, password}) => {
    try {
        return new Promise((resolve, reject) => {
            let query = {};
            if(username){
                query = { username: username}
            } else {
                query = { email: email}
            }
            User.findOne(query).then((user)=>{
                if(user){
                    bcrypt.compare(password, user.password).then((result)=>{
                        if(result){
                            generateJwt(user).then((token)=>{
                                resolve({status: 200, message: 'Login successful', token});
                            }).catch((error)=>{
                                console.log("Error in generating token: " + error);
                            })
                        } else {
                            throw new Error("wrong password")
                        }
                    }).catch((error)=>{
                        console.log("Error in comparing password", error);
                        resolve({ status: 401, message: "Wrong password" });
                    })
                } else {
                    throw new Error("user not found");
                }
            }).catch((error) => {
                console.log("Error in fetching user while login", error);
                resolve({ status: 422, message: "Account does not exist" });
            })
        })
    } catch (error) {
        console.log("error in login", error);
    }
}




export const registration = ({username,email,password})=>{
    try {
        return new Promise((resolve, reject) => {
            const name = email.split("@");
            bcrypt.hash(password, saltRounds).then((hashedPassword)=>{
                const newUser = new User({
                    username: username,
                    email: email,
                    password: hashedPassword,
                    name: name[0]
                });

                newUser.save().then((response)=>{
                    resolve({
                        status: 200,
                        message: "Account created successfully",
                    });
                }).catch((error)=>{
                    resolve({
                      error_code: "DB_SAVE_ERROR",
                      message: "omethings wrong try after sometimes",
                      status: 500,
                    });
                    console.log("error saving new user: " + error);
                })
            }).catch((error)=>{
                resolve({
                    error_code: "PSW_HASHING_ERROR",
                    message:"Somethings wrong try after sometimes",
                    status:500
                });
                console.log("error hashing password: " + error);
            })
        });
    } catch (error) {
        console.log("Error in registration(userHelper): " + error);
    }
};




export const getUsers = (query) =>{
    try {
        return new Promise((resolve, reject) => {
            User.find(query).select("-password").then((users) => {
                resolve({status:200, message: "User fetched successfully", users});
            }).catch((err) => {
                console.log("error fetching users", err);
                resolve({
                  status: 500,
                  message: "Something went wrong",
                  error_code: "DB_FETCH_ERROR",
                });
            })
        })
    } catch (error) {
        console.log("error getting users: " + error);
    }
};