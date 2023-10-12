import bcrypt, { hash } from "bcrypt"; //imporing bcrypt
const saltRounds = 10; //setting salt rounds
import generateJwt from "../services/jwt.js"; //imporing jwt function to generate jwt token

//importing models
import { User } from "../models/userModel.js"; //userModel
import {verificationEmail, verifyOtpToken} from "../services/nodemailer.js";
import { Verify } from "../models/verifyModel.js";
import { Post } from "../models/postModel.js";
import { Connection } from "../models/connectionModel.js";

// @desc    Login user
// @route   POST /users/login
// @access  Public
export const userLogin = ({ username, email, password }) => {
  try {
    return new Promise((resolve, reject) => {
      let query = {};
      if (username) {
        query = { username: username };
      } else {
        query = { email: email };
      }
      User.findOne(query)
        .then((user) => {
          if (user) {
            bcrypt
              .compare(password, user.password)
              .then((result) => {
                console.log(result);
                if (result) {
                  if (!user.blocked) {
                    generateJwt(user)
                      .then((token) => {
                        resolve({
                          status: 200,
                          message: "Login successful",
                          token,
                          user
                        });
                      })
                      .catch((error) => {
                        console.log("Error in generating token: ", error);
                      });
                  } else {
                    resolve({
                      status: 401,
                      message:
                        "Sorry, Your account has been temporarily blocked.",
                    });
                  }
                } else {
                  resolve({ status: 401, message: "Wrong password" });
                }
              })
              .catch((error) => {
                console.log("Error in comparing password", error);
              });
          } else {
            throw new Error("user not found");
          }
        })
        .catch((error) => {
          console.log("Error in fetching user while login", error);
          resolve({ status: 422, message: "Account does not exist" });
        });
    });
  } catch (error) {
    console.log("error in login", error);
  }
};

// @desc    Register user
// @route   POST /users/register
// @access  Public
export const registration = ({ username, email, password }) => {
  try {
    return new Promise(async (resolve, reject) => {
      if (await User.findOne({ email: email })) {
        resolve({
          status: 409,
          error_code: "USER_ALREADY_REGISTERED",
          message: "Email has already been registered",
        });
      }
      if (await User.findOne({ username: username })) {
        resolve({
          status: 409,
          error_code: "USERNAME_TAKEN",
          message: "Username already in use",
        });
      }

      const name = email.split("@");
      bcrypt
        .hash(password, saltRounds)
        .then((hashedPassword) => {
          const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
            name: name[0],
          });

          newUser
            .save()
            .then((response) => {
              resolve({
                status: 200,
                message: "Account created successfully",
              });
            })
            .catch((error) => {
              resolve({
                error_code: "DB_SAVE_ERROR",
                message: "omethings wrong try after sometimes",
                status: 500,
              });
              console.log("error saving new user: " + error);
            });
        })
        .catch((error) => {
          resolve({
            error_code: "PSW_HASHING_ERROR",
            message: "Somethings wrong try after sometimes",
            status: 500,
          });
          console.log("error hashing password: " + error);
        });
    });
  } catch (error) {
    console.log("Error in registration(userHelper): " + error);
  }
};

// @desc    Fetch users || Fetch user
// @route   GET /admin/users
// @access  Public
export const getUsers = (query) => {
  try {
    return new Promise((resolve, reject) => {
      User.find(query)
        .select("-password")
        .exec()
        .then((users) => {
          resolve({ status: 200, message: "User fetched successfully", users });
        })
        .catch((err) => {
          console.log("error fetching users", err);
          resolve({
            status: 500,
            message: "Something went wrong",
            error_code: "DB_FETCH_ERROR",
          });
        });
    });
  } catch (error) {
    console.log("error getting users: " + error);
  }
};

// @desc    Sent verification link
// @route   GET /admin/users
// @access  Public
export const verifyEmail = (email) => {
  return new Promise((resolve, reject) => {
    try {
      User.findOne({ email: email })
        .select("-password")
        .exec()
        .then((user) => {
          if (user) {
            verificationEmail(user.email, user.username)
              .then((response) => {
                resolve({
                  status: 200,
                  message: "verification email has been sent.",
                });
              })
              .catch((error) => {
                reject(error);
              });
          } else {
            reject({ status: 404, message: "User not found" });
          }
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Somethings wrong please try after sometime.",
      });
    }
  });
};



// @desc    Verify email
// @route   GET /admin/users
// @access  Public
export const verifyEmailToken = (email, token) => {
  return new Promise((resolve, reject) => {
    try {
      verifyOtpToken(email, token).then(async (response) => {
          User.findOne({email: email}).then((user)=> {
            if (!user.blocked) {
              generateJwt(user)
                .then((jwtToken) => {
                  resolve({
                    status: 200,
                    message: "Login successful",
                    token: jwtToken,
                    user,
                    valid: true
                  });
                })
                .catch((error) => {
                  reject(error);
                });
            } else {
              reject({
                status: 401,
                message: "Sorry, Your account has been temporarily blocked.",
              });
            }
          }).catch((error) => {
            reject(error);
          })
      }).catch((error) => {
        reject(error);
      })
    } catch (error) {
      reject({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Somethings wrong please try after sometime.",
      });
    }
  });
};







// @desc    Save post
// @route   PUT /user/:userId/save/post/:postId
// @access  Registerd users
export const savePostHelper = (userId, postId) => {
  return new Promise((resolve, reject) => {
    try {
      User.findOneAndUpdate({_id: userId}, {$push: {savedPosts: postId}}, {new: true}).then((user)=> {
        Post.findOneAndUpdate({_id: postId}, {$push: {saved: userId}}, {new: true}).then((post)=> {
          resolve({user, post})
        }).catch((error) => reject(error))
      }).catch((err) => {
        reject(err);
      })
    } catch (error) {
      reject(err);
    }
  })
};

// @desc    Remove from saved
// @route   DELETE /user/:userId/save/post/remove/:postId
// @access  Registerd users
export const removeSavePostHelper = (userId, postId) => {
  return new Promise((resolve, reject) => {
    try {
      User.findOneAndUpdate({_id: userId}, {$pull: {savedPosts: postId}}, {new: true}).then((user)=> {
        Post.findOneAndUpdate({_id:postId}, {$pull: {saved: userId}}, {new: true}).then((post)=> {
          resolve({user, post})
        }).catch((error) => reject(error))
      }).catch((error)=> {
        reject(error);
      })
    } catch (error) {
      reject(error);
    }
  })
};




///////////////////////////////////////////----CONNECTION SECTION----/////////////////////////////////////////////////////////////////

const isValidUserId = async (userId) => {
  try {
    const user = await User.findOne({_id: userId});
    return !!user;
  } catch (error) {
    return false;
  }
}

// @desc    Follow user
// @route   POST /user/:userId/follow/:followeeUserId
// @access  Registerd users
export const followHelper = (userId, followeeId) => {
  return new Promise((resolve, reject) => {
    try {
      //Checking userIDs
      if (!isValidUserId(userId) && !isValidUserId(followeeId)) {
        reject(new Error("Invalid user ID"));
        return;
      }

      Connection.findOneAndUpdate(
        { userId: userId },
        { $addToSet: { following: followeeId } },
        { upsert: true, new: true }
      )
        .then((userConnection) => {
          Connection.findOneAndUpdate(
            { userId: followeeId },
            { $addToSet: { followers: userId } },
            { upsert: true, new: true }
          )
            .then((followeeConnection) => {
              resolve({ userConnection, followeeConnection });
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error)
    }
  })
}


// @desc    Unfollow user
// @route   POST /user/:userId/unfollow/:followeeUserId
// @access  Registerd users
export const unfollowHelper = (userId, followeeId) => {
  return new Promise((resolve, reject) => {
    try {
      //Checking userIDs
      if (!isValidUserId(userId) && !isValidUserId(followeeId)) {
        reject(new Error("Invalid user ID"));
        return;
      }

      Connection.findOneAndUpdate(
        { userId: userId },
        { $pull: { following: followeeId } },
        { new: true }
      )
        .then((userConnection) => {
          Connection.findOneAndUpdate(
            { userId: followeeId },
            { $pull: { followers: userId } },
            { new: true }
          )
            .then((followeeConnection) => {
              resolve({ userConnection, followeeConnection });
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  })
};