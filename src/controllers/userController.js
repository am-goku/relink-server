import { json, response } from "express";

//importing Helpers
import { fetchUserById, followHelper, getConnectonHelper, getUsers, registration, removeSavePostHelper, savePostHelper, searchUserHelper, unfollowHelper, updateUserHelper, userByUsernameHelper, userLogin, verifyEmail, verifyEmailToken } from "../helpers/userHelper.js";


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
export const fetch_Users = (req, res) => {
  try {
    const {userId} = req.query || ''

    fetchUserById(userId).then((response) => {
      res.status(200).json(response)
    }).catch((err) => {
      res.status(500).json(err);
    })
  } catch (error) {
    console.log("error in fetchUsers (userController)", error);
    res.status(500).json(err);
  }
};


// @desc    Get users
// @route   GET /user/fetch-users
// @access  Public
export const fetchUsers = (req, res) => {
  try {
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 7;
    const search = req.query.search || '';

    getUsers(page, perPage, search).then((response) => {
      res.status(200).json(response)
    }).catch((err) => {
      res.status(500).json(err);
    })
  } catch (error) {
    console.log("error in fetchUsers (userController)", error);
    res.status(500).json(err);
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
    console.log(req.body);
    verifyEmailToken(email, otpToken).then((response)=> {
      res.status(200).send(response);
    }).catch((error)=> {
      console.log(error);
      res.status(error.status).send(error);
    })
  } catch (error) {
    res.status(500).send(error)
  }
};


// @desc    Save post
// @route   PUT /user/:userId/save/post/:postId
// @access  Registerd users
export const savePost = (req, res) => {
  try {
    const {userId, postId} = req.params;
    savePostHelper(userId, postId).then((response) => {
      res.status(200).send(response);
    }).catch((error) => {
      res.status(500).send(error);
    })
  } catch (error) {
    res.status(500).send(error);
  }
}

// @desc    Remove saved post
// @route   PUT /user/:userId/save/post/remove/:postId
// @access  Registerd users
export const removeSavedPost = (req, res) => {
  try {
    const { userId, postId } = req.params;
    removeSavePostHelper(userId, postId).then((response)=> {
      res.status(200).send(response);
    }).catch((error) => {
      res.status(500).send(error);
    })
  } catch (error) {
    res.status(500).send(error);
  }
}




///////////////////////////////////////////----CONNECTION SECTION----/////////////////////////////////////////////////////////////////

// @desc    Follow user
// @route   POST /user/:userId/follow/:followeeUserId
// @access  Registerd users
export const followUser = (req, res) => {
  try {
    const {userId, followeeUserId} = req.params;
    followHelper(userId, followeeUserId).then((response) => {
      res.status(200).send(response);
    }).catch((error) => {
      res.status(500).send(error);
    })
  } catch (error) {
    res.status(500).send(error);
  }
}

// @desc    Unfollow user
// @route   POST /user/:userId/unfollow/:followeeUserId
// @access  Registerd users
export const unfollowUser = (req, res) => {
  try {
    const { userId, followeeUserId } = req.params;
    unfollowHelper(userId, followeeUserId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } catch (error) {
    res.status(500).send(error);
  }
};

// @desc    Get connections
// @route   GET /user/fetch/connection/:userId
// @access  Registerd users
export const getConnection = (req, res) => {
  try {
    const {userId} = req.params;
    getConnectonHelper(userId).then((connection) => {
      res.status(200).send(connection);
    }).catch((err) => {
      res.status(500).send(err)
    })
  } catch (error) {
    res.status(500).send(err);
  }
}





// @desc    Search user
// @route   GET /user/search/:Key
// @access  Registerd users
export const searchUser = (req, res) => {
  try {
    const {key} = req.params;
    searchUserHelper(key).then((users)=> {
      res.status(200).send(users);
    }).catch((err) => {
      res.status(500).send(err)
    })
  } catch (error) {
    res.status(500).send(error);
  }
};



///////////////////////////////////////////----FETCH USER SECTION----/////////////////////////////////////////////////////////////////

// @desc    Fetch user by username
// @route   /user/fetch/user/username/:username
// @access Authenticated users
export const fetchUserByUsername = (req, res) => {
  try {
    const {username} = req.params;
    userByUsernameHelper(username).then((user)=> {
      res.status(200).send(user);
    }).catch((error) => {
      res.status(500).send(error)
    })
  } catch (error) {
    res.status(500).send(error);
  }
}





// @desc    Search user
//route     /user/update/user/:username
// @access  Registerd users
export const updateUser = (req, res) => {
  try {
    const {username} = req.params;
    updateUserHelper(req.body, username).then((response)=> {
      res.status(200).json(response);
    }).catch((err)=> {
      res.status(500).send(err);
    })
  } catch (error) {
    res.status(500).send(error);
  }
}