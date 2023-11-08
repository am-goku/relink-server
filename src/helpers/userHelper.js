import bcrypt, { hash } from "bcrypt"; //imporing bcrypt
const saltRounds = 10; //setting salt rounds
import generateJwt from "../services/jwt.js"; //imporing jwt function to generate jwt token

//importing models
import { User } from "../models/userModel.js"; //userModel
import { generateTokenForPassword, verificationEmail, verifyOtpToken } from "../services/nodemailer.js";
import { Post } from "../models/postModel.js";
import { Connection } from "../models/connectionModel.js";
import { Report } from "../models/reportsModel.js";
import { notifyFollow } from "./notificationHelper.js";





////////////////////////////////////////////////// USER LOGIN & REGISTRATION //////////////////////////////////////////////////////////////////
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
                if (result) {
                  if (!user.blocked) {
                    generateJwt(user)
                      .then((tokens) => {
                        resolve({
                          status: 200,
                          message: "Login successful",
                          tokens,
                          user
                        });
                      })
                      .catch((error) => {
                        console.log("Error in generating token: ", error);
                        throw new Error(`${error}`);
                      });
                  } else {
                    reject({
                      status: 403,
                      message:
                        "Sorry, Your account has been temporarily blocked.",
                    });
                  }
                } else {
                  reject({ status: 403, message: "Wrong password" });
                }
              })
              .catch((error) => {
                console.log("Error in comparing password", error);
                throw new Error(`${error}`);
              });
          } else {
            throw new Error("user not found");
          }
        })
        .catch((error) => {
          console.log("Error in fetching user while login", error);
          reject({ status: 422, message: "Account does not exist", err });
        });
    });
  } catch (error) {
    console.log("error in login", error);
    reject({
      error_code: "INTERNAL_SERVER_ERROR",
      message: "Somethings wrong try after sometimes",
      status: 500,
    });
  }
};

// @desc    Login google user
// @route   POST /user/login/Oauth
// @access  Public
export const OauthLoginHelper = (userData) => {
  return new Promise((resolve, reject) => {
    User.findOne({email: userData.email}).select("-password").then(async (user) => {
      if(user){
        if(!user?.blocked){
          const tokens = await generateJwt(user);
          resolve({
            status: 200,
            message: "Login successful",
            tokens,
            user,
            isValid: true,
          });
        } else {
          reject({
            status: 403,
            error_code: "FORBIDDEN_USER",
            message: "Blocked user"
          })
        }
      } else {
        //new user
        reject({
          status: 404,
          error_code: "USER_NOT_FOUND",
          message: "User not found",
        });
      }
    }).catch((err)=> {
      reject({
        status: 500,
        error_code: "DB_FETCH_ERROR",
        message: "Error fetching user.",
        err
      })
    })
  })
}

// @desc    Register user
// @route   POST /users/register
// @access  Public
export const registration = ({ username, email, password }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (await User.findOne({ email: email })) {
        reject({
          status: 409,
          error_code: "USER_ALREADY_REGISTERED",
          message: "Email has already been registered",
        });
      }
      if (await User.findOne({ username: username })) {
        reject({
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
              reject({
                error_code: "DB_SAVE_ERROR",
                message: "omethings wrong try after sometimes",
                status: 500,
              });
            });
        })
        .catch((error) => {
          reject({
            error_code: "PSW_HASHING_ERROR",
            message: "Somethings wrong try after sometimes",
            status: 500,
          });
        });
    } catch (error) {
      reject({
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Somethings wrong try after sometimes",
        status: 500,
      });
      console.log("Error in registration(userHelper): " + error);
    }
  });
};

// @desc    Register google user
// @route   POST /user/register/Oauth
// @access  Public
export const regOauthHelper = (userData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (await User.findOne({ email: userData.email })) {
        reject({
          status: 409,
          error_code: "USER_ALREADY_REGISTERED",
          message: "Email has already been registered",
        });
      }
      if (await User.findOne({ username: userData.username })) {
        reject({
          status: 409,
          error_code: "USERNAME_TAKEN",
          message: "Username already in use",
        });
      }

      const newUser = new User({
        email: userData?.email,
        username: userData?.username,
        name: userData?.name,
        profilePic: userData?.image,
      });

      newUser
        .save()
        .then(async (user) => {
          const tokens = await generateJwt(user);
          resolve({
            tokens,
            user,
            isValid: true,
            status: 200,
            message: "Login successful",
          });
        })
        .catch((err) => {
          reject({
            error_code: "DB_SAVE_ERROR",
            message: "Somethings wrong try after sometimes",
            status: 500,
          });
        });
    } catch (error) {
      reject({
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Somethings wrong try after sometimes",
        status: 500,
      });
    }
  });
};

////////////////////////////////////////////////// USER FETCH //////////////////////////////////////////////////////////////////
// @desc    Get users
// @route   GET /user/fetch-users
// @access  Public
export const fetchUserById = (userId) => {
  return new Promise((resolve, reject) => {
    try {
      let query = {};
      if (userId && userId !== undefined) {
        query = { _id: userId };
      }
      User.find(query)
        .select("-password")
        .exec()
        .then((user) => {
          resolve(user);
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

// @desc    Get users with email
// @route   GET /user/fetch-user/email/:email
// @access  Public
export const getUserWithEmail = (email) => {
  return new Promise((resolve, reject) => {
    User.findOne({email: email}).select("-password").then((user) => {
      resolve(user);
    }).catch((error) => {
      reject(error);
    })
  })
}

////////////////////////////////////////////////// EMAIL VARIFICATION //////////////////////////////////////////////////////////////////
// @desc    Sent verification link
// @route   GET /auth/sent-verification
// @access  Public - Registerd users
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
// @route   GET /auth/verify-otpToken
// @access  Public - Registerd users
export const verifyEmailToken = (email, token) => {
  return new Promise((resolve, reject) => {
    try {
      verifyOtpToken(email, token).then(async (response) => {
          User.findOne({email: email}).then((user)=> {
            if (!user.blocked) {
              generateJwt(user)
                .then((jwtTokens) => {
                  resolve({
                    status: 200,
                    message: "Login successful",
                    tokens: jwtTokens,
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



////////////////////////////////////////////////// POST SAVE SECTION //////////////////////////////////////////////////////////////////
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




////////////////////////////////////////////////// CONNECTION SECTION //////////////////////////////////////////////////////////////////
// @desc    To check valid user
// @access  Private
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
      ).exec()
        .then((userConnection) => {
          Connection.findOneAndUpdate(
            { userId: followeeId },
            { $addToSet: { followers: userId } },
            { upsert: true, new: true }
          ).exec()
            .then((followeeConnection) => {

              //notifying the follow event
              notifyFollow(followeeId, userId);

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
  return new Promise(async (resolve, reject) => {
    try {
      // Validate user IDs
      if (!isValidUserId(userId) || !isValidUserId(followeeId)) {
        reject(new Error("Invalid user ID"));
        return;
      }

      // Update the user's following list
      const userConnection = await Connection.findOneAndUpdate(
        { userId: userId },
        { $pull: { following: followeeId } },
        { new: true }
      ).exec();

      // Update the followee's followers list
      const followeeConnection = await Connection.findOneAndUpdate(
        { userId: followeeId },
        { $pull: { followers: userId } },
        { new: true }
      ).exec();

      resolve({ userConnection, followeeConnection });
    } catch (error) {
      reject(error);
    }
  })
};

// @desc    Get connections
// @route   GET /user/fetch/connection/:userId
// @access  Registerd users
export const getConnectonHelper = (userId) => {
  return new Promise((resolve, reject) => {
    try {
      Connection.findOne({userId: userId}).then((connection) => {
        resolve(connection);
      }).catch((error) => reject({
        status:500,
        error_code: "DB_FETCH_ERROR",
        message:error.message,
        error
      }));
    } catch (error) {
      reject({
        status:500,
        error_code: "INTERNAL_SERVER_ERROR",
        message:error.message,
        error
      });
    }
  })
}



////////////////////////////////////////////////// FETCH USER //////////////////////////////////////////////////////////////////
// @desc    Search user
// @route   GET /user/search/:Key
// @access  Registerd users
export const searchUserHelper = (key) => {
  return new Promise((resolve, reject) => {
    try {
      const regex = new RegExp(key, 'i');
      User.find({name: regex, blocked: false}).then((users)=> {
        resolve(users);
      }).catch((err) => reject(err));
    } catch (error) {
      reject(error);
    }
  })
}

// @desc    Search user by username
// @route   GET /user/fetch/user/username/:username
// @access  Registerd users
export const userByUsernameHelper = (username) => {
  return new Promise((resolve, reject) => {
    try {
      User.findOne({username: username}).select("-password")
      .exec()
      .then((user)=>{
        resolve(user);
      }).catch((err) => {
        resolve({
          status: 500,
          error_code: "DB_FETCH_ERROR",
          message: err.message
        })
      })
    } catch (error) {
      resolve({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: err.message,
      });
    }
  })
}



////////////////////////////////////////////////// UPDATE USER //////////////////////////////////////////////////////////////////
// @desc    Search user
//route     /user/update/user/:username
// @access  Registerd users
export const updateUserHelper = (data, username)=> {
  return new Promise((resolve, reject) => {
    try {
      User.findOneAndUpdate({ username: username }, {...data}, { new: true })
        .select("-password")
        .exec()
        .then((user) => {
          resolve(user);
        })
        .catch((err) => {
          reject({
            status: 500,
            error_code: "DB_UPDATE_ERROR",
            message: err.message,
            err,
          });
        });
    } catch (error) {
      reject({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: err.message,
        err,
      });
    }
  })
}




////////////////////////////////////////////////// REPORT SECTION //////////////////////////////////////////////////////////////////

// @desc    Report user
// @route   POST /user/report/user/:userId
// @access  Registerd users
export const reportUserHelper = (userId, username, targetId, details) => {
  return new Promise((resolve, reject) => {
    try {
      const newReport = new Report({
        reporterId: userId,
        targetId: targetId,
        details: details,
        reportType: "UserReport",
        reporterUsername: username,
      });

      newReport.save().then((response) => {
        resolve(response);
      }).catch((err)=> {
        reject({
          status: 500,
          error_code: "DB_FETCH_ERROR",
          message: "Error saving to DB",
          err
        })
      })
    } catch (error) {
      reject({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Server side error",
        error,
      });
    }
  })
};




// @desc    Register fcm
// @route   GET /user/fcm/:userId/:fcmToken
// @access  Registerd users
export const registerFcmHelper = (userId, fcmToken) => {
  return new Promise((resolve, reject) => {
    User.updateMany(
      { fcmToken: fcmToken, _id: { $ne: userId } },
      { $set: { fcmToken: "" } }
    )
      .then((res) => {
        console.log("final updates", res);
        User.findOneAndUpdate({ _id: userId }, { fcmToken: fcmToken })
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  })
}



// @desc    To delete the fcm from user
// @access  Private
export const removeFcmToken = (userId) => {
  return new Promise((resolve, reject) => {
    User.updateOne({_id: userId}, {$unset: {fcmToken: 1}}).then(() => {
      resolve(true);
    }).catch(err => reject(err));
  })
}






/////////////////////////////// password management //////////////////////////////

export const changePasswordRequestHelper = (userId, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.findOne({_id: userId});

      generateTokenForPassword({email: user.email, password: hashedPassword, username: user.username}).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      })
    } catch (error) {
      reject(error);
    }
  })
}