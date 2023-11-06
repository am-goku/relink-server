//importing Helpers
import {
  OauthLoginHelper,
  fetchUserById,
  followHelper,
  getConnectonHelper,
  getUserWithEmail,
  regOauthHelper,
  registerFcmHelper,
  registration,
  removeFcmToken,
  removeSavePostHelper,
  reportUserHelper,
  savePostHelper,
  searchUserHelper,
  unfollowHelper,
  updateUserHelper,
  userByUsernameHelper,
  userLogin,
  verifyEmail,
  verifyEmailToken,
} from "../helpers/userHelper.js";




////////////////////////////////////////////////// USER LOGIN & REGISTRATION //////////////////////////////////////////////////////////////////
// @desc    Login user
// @route   POST /user/login
// @access  Public
export const login = (req, res, next) => {
  try {
    const userData = req.body;
    userLogin(userData).then((data) => {
      res.status(200).json(data);
    }).catch((err) => {
      res.status(500).send(err);
    })
  } catch (error) {
    res.status(500).send(error);
  }
}

// @desc    Login google user
// @route   POST /user/login/Oauth
// @access  Public
export const OauthLogin = (req, res, next) => {
  try {
    const userData = req.body;
    OauthLoginHelper(userData).then((response) => {
      res.status(200).json(response);
    }).catch((err)=> {
      res.status(500).send(err)
    })
  } catch (error) {
    res.status(500).send(error)
  }
}

// @desc    Register user data
// @route   POST /user/register
// @access  Public
export const registerUser = (req, res) => {
  try {
    const userData = req.body;
    registration(userData)
      .then((response) => {
        res.status(200).json({...response})
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } catch (error) {
    res.status(500).send(error);
  }
};

// @desc    Register google user
// @route   POST /user/register/Oauth
// @access  Public
export const regOauthUser = (req, res) => {
  try {
    const userData = req.body;
    regOauthHelper(userData).then((response) => {
      res.status(200).json(response);
    }).catch((err) => {
      res.status(500).send(err);
    })
  } catch (error) {
    res.status(500).send(error);
  }
}



////////////////////////////////////////////////// USER FETCH //////////////////////////////////////////////////////////////////
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

// @desc    Get users with email
// @route   GET /user/fetch-user/email/:email
// @access  Public
export const fetchUserByEmail = (req, res) => {
  try {
    const email = req.params.email;
    getUserWithEmail(email).then((response)=> {
      res.status(200).send(response);
    }).catch((error) => {
      res.status(200).send(error)
    })
  } catch (error) {
    res.status(500).send(error)
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



////////////////////////////////////////////////// UPDATE USER //////////////////////////////////////////////////////////////////
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



////////////////////////////////////////////////// EMAIL VARIFICATION //////////////////////////////////////////////////////////////////
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
      console.log(error);
      res.status(error.status).send(error);
    })
  } catch (error) {
    res.status(500).send(error)
  }
};



////////////////////////////////////////////////// POST SAVE SECTION //////////////////////////////////////////////////////////////////
// @desc    Save post
// @route   PUT /user/:userId/save/post/:postId
// @access  Registerd users
export const savePost = (req, res) => {
  try {
    const {userId, postId} = req.params;
    savePostHelper(userId, postId).then((response) => {
      res.status(200).json(response);
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
      res.status(200).json(response);
    }).catch((error) => {
      res.status(500).send(error);
    })
  } catch (error) {
    res.status(500).send(error);
  }
}


////////////////////////////////////////////////// CONNECTION SECTION //////////////////////////////////////////////////////////////////
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
};




////////////////////////////////////////////////// REPORT SECTION //////////////////////////////////////////////////////////////////

// @desc    Report user
// @route   GET /user/report/user/:userId
// @access  Registerd users
export const reportUser = (req, res) => {
  try {
    const {userId, username} = req.params;
    const {targetId, details} = req.body;
    reportUserHelper(userId, username, targetId, details).then((response)=> {
      res.status(200).send(response)
    }).catch((err)=> {
      res.status(500).send(err)
    })
  } catch (error) {
    res.status(500).send(error);
  }
}




// @desc    Register fcm
// @route   GET /user/fcm/:userId/:fcmToken
// @access  Registerd users
export const registerFcmToken = (req, res) => {
  try {
    const {userId, fcmToken} = req.params;
    
    registerFcmHelper(userId, fcmToken).then((response)=> {
      res.status(200).send(response);
    }).catch((err)=>{
      res.status(500).send(err)
    })
  } catch (error) {
    res.status(500).send(error)
  }
}





// @desc    Logout user
// @route   POST /user/logout/:userId
// @access  Registerd users
export const logout = (req, res) => {
  try {
    const userId = req.params.userId;
    removeFcmToken(userId).then((response)=> {
      res.status(200).send({status: 'OK'})
    }).catch((error)=> {
      res.status(500).send(error)
    })
  } catch (error) {
    res.status(500).send(error);
  }
}