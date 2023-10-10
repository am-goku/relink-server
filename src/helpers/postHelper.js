//importing models
import { Post } from "../models/postModel";

// @desc    Create post
// @route   POST /users/create-post
// @access  Public
export const createPost = ({ userId, image, description }) => {
  return new Promise((resolve, reject) => {
    try {
      const newPost = new Post({
        userId: userId,
        image: image,
        description: description,
      });
      newPost
        .save()
        .then((post) => {
          if (post) {
            resolve({
              status: 200,
              message: "Created post successfully",
              post,
            });
          } else {
            throw new Error("No response found");
          }
        })
        .catch((err) => {
          console.log("Error saving post", err);
          reject({
            status: 500,
            error_code: "DB_SAVE_ERROR",
            message: "Somethings wrong, Please try again later.",
            error_message: err.message,
          });
        });
    } catch (error) {
      reject({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Somethings wrong, Please try again later.",
        error_message: error.message,
      });
    }
  });
};


// @desc    Fetch posts
// @route   POST /users/fetch-posts
// @access  Public
export const getAllPosts = (query) => {
  return new Promise((resolve, reject) => {
    try {
      Post.find(query)
        .sort({ date: -1 })
        .exec()
        .then((posts) => {
          if (posts) {
            resolve({
              status: 200,
              message: "post fetched successfully",
              posts,
            });
          } else {
            throw new Error("No posts found");
          }
        })
        .catch((err) => {
          reject({
            status: 500,
            error_code: "DB_FETCH_ERROR",
            message: "Somethings wrong, Please try again later.",
            error_message: err.message
          });
        });
    } catch (error) {
      reject({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Somethings wrong, Please try again later.",
        error_message: error.message,
      });
    }
  });
};





// @desc    Fetch a user's posts
// @route   GET /post/fetchUserPosts
// @access  Registerd users
export const fetchUserPosts = (userId) => {
  return new Promise ((resolve, reject) => {
    try {
      Post.find({userId: userId}).lean().then((posts)=> {
        resolve(posts);
      }).catch((err) => {
        reject(err);
      })
    } catch (error) {
      reject(error);
    }
  })
}
