//importing models
import { Post } from "../models/postModel";

// @desc    Create post
// @route   POST /users/create-post
// @access  Public
export const createPost = ({ userId, image, description }) => {
  try {
    return new Promise((resolve, reject) => {
      const newPost = new Post({
        userId: userId,
        image: image,
        description: description,
      });
      newPost
        .save()
        .then((response) => {
          if (response) {
            resolve({
              status: 200,
              message: "Created post successfully",
            });
          } else {
            throw new Error("No response found");
          }
        })
        .catch((err) => {
          console.log("Error saving post", err);
          resolve({
            status: 500,
            error_code: "DB_SAVE_ERROR",
            message: "Somethings wrong, Please try again later.",
          });
        });
    });
  } catch (error) {
    console.log("error in creating Post (in postHelper)", error);
  }
};


// @desc    Fetch posts
// @route   POST /users/fetch-posts
// @access  Public
export const getAllPosts = (query) => {
  try {
    return new Promise((resolve, reject) => {
      Post.find(query).sort({date:-1}).exec()
        .then((posts) => {
          if (posts) {
            console.log(posts);
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
          console.log("Error fetching posts from database", err);
          resolve({
            status: 500,
            error_code: "DB_FETCH_ERROR",
            message: "Somethings wrong, Please try again later.",
          });
        });
    });
  } catch (error) {
    console.log("Error in getting list of posts (in postHelper)", error);
  }
};




