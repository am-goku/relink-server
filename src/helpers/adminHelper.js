import generateJwt from "../services/jwt"; //importing function to generate JWT Token
import bcrypt from "bcrypt";  //importing bcrypt

//importing models
import { Admin } from "../models/adminModel.js";
import { User } from "../models/userModel.js";
import { Post } from "../models/postModel.js";
import { Report } from "../models/reportsModel.js";



////////////////////////////////////////////////// ADMIN LOGIN //////////////////////////////////////////////////////////////////
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
          .then((adminTokens) => {
            resolve({
              status: 200,
              message: "Admin login successful",
              adminTokens,
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



////////////////////////////////////////////////// USER RELATED //////////////////////////////////////////////////////////////////
// @desc    Fetch users (with pagination and filters)
// @route   GET /admin/fetch-users
// @access  Admin - private
export const getUsers = (page, perPage, search) => {
  return new Promise((resolve, reject) => {
    try {
      const regex = search? new RegExp(search, "i") : /.*/;
      User.find({name: regex})
        .skip((page - 1) * perPage)
        .limit(perPage)
        .select("-password")
        .exec()
        .then((users) => {
          resolve(users);
        })
        .catch((err) => {
          console.log("error fetching users", err);
          reject({
            status: 500,
            message: err.message,
            error_code: "DB_FETCH_ERROR",
            err,
          });
        });
    } catch (error) {
      console.log("error getting users: " + error);
      reject({
        status: 500,
        message: error.message,
        error_code: "INTERNAL_SERVER_ERROR",
        error,
      });
    }
  });
};

// @desc    Block / Unblock user with posts
// @route   PATCH /admin/:userId/change-status
// @access  Admin - private
const userPostsBlockStatus =(userId, status) => {
  return new Promise((resolve, reject) => {
    try {
      Post.updateMany({userId: userId}, {$set: {blocked: status}}).then((res) => {
        resolve(res)
      }).catch((error) => reject(error))
    } catch (error) {
      reject(error);
    }
  })
}//function to update the status of posts when the user block status updates
export const toggelBlockStatus = (userId, status) => {
  return new Promise((resolve, reject) => {
    try {
      User.findOneAndUpdate({ _id: userId }, { blocked: status }, { new: true })
        .select("-password")
        .exec()
        .then((response) => {
          userPostsBlockStatus(userId, status).then((res)=>{
            resolve({
              status: 200,
              message: "User block status updated",
              user: response,
            });
          }).catch((err) => {
            resolve({
              status: 500,
              error_code: "DB_UPDATE_ERROR",
              message: err.message,
            });
          })
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




/////////////////////////////////////////////////// REPORT SECTIONS //////////////////////////////////////////////////////////////////
// @desc    Fetch user reports
// @route   GET /admin/reports/users
// @access  Admins
export const getUserReportsHelper = (page, perPage, search) => {
  return new Promise((resolve, reject) => {
    try {
      const regex = search ? new RegExp(search, "i") : /.*/;
      Report.find({ reporterUsername: regex, reportType: "UserReport" })
        .skip((page - 1) * perPage)
        .limit(perPage).then((reports) => {
          console.log(reports);
          resolve(reports);
        }).catch((err) =>{
          reject({
            status: 500,
            error_code: "DB_FETCH_ERROR",
            message: "Error fetching DB",
            err
          })
        })
    } catch (error) {
      reject({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
        error,
      });
    }
  })
};

// @desc    Fetch post reports
// @route   GET /admin/reports/users
// @access  Admins
export const getPostReportsHelper = (page, perPage, search) => {
  return new Promise((resolve, reject) => {
    try {
      const regex = search ? new RegExp(search, "i") : /.*/;
      Report.find({ reporterUsername: regex, reportType: "PostReport" })
        .skip((page - 1) * perPage)
        .limit(perPage).then((reports) => {
          resolve(reports);
        }).catch((err) =>{
          reject({
            status: 500,
            error_code: "DB_FETCH_ERROR",
            message: "Error fetching DB",
            err
          })
        })
    } catch (error) {
      reject({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
        error,
      });
    }
  })
};



// @desc    Fetch posts with pagination and populated user
// @route   GET /admin/fetch-posts
// @access  Admins
export const fetchPostsHelper = (page, perPage, search) => {
  return new Promise((resolve, reject) => {
    try {
      const regex = search ? new RegExp(search, "i") : /.*/;
      const populateOptions = [
        {
          $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" }
        }
      ];
      if(search){
        populateOptions.push({$match: {"user.username":regex}})
      }

      populateOptions.push(
        { $skip: (page - 1) * perPage },
        { $limit: perPage }
      );
      
      Post.aggregate(populateOptions).exec()
        .then((results) => {
          resolve(results);
        })
        .catch((err) => {
          console.log(err);
          reject({
            status: 500,
            error_code: "DB_FETCH_ERROR",
            message: "Error fetching DB",
            err,
          });
        });
    } catch (error) {
      console.log(error);
      reject({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
        error,
      });
    }
  })
}








//////////////////////////////// POST RELATED //////////////////////////////////

// @desc    Block a Post
// @route   GET /admin/post/block/:postId
// @access  Admins
export const blockPostHelper = (postId) => {
  return new Promise((resolve, reject) => {
    try {
      Post.findOneAndUpdate({_id:postId}, {adminBlock: true}).then((response)=> {
        resolve(response);
      }).catch((err) => {
        reject(err);
      })
    } catch (error) {
      reject(error);
    }
  })
}





