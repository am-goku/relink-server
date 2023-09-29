import { Post } from "../models/postModel";




// function which helps to create a new post data into the databse and it allows the client to upload a new
// post in the databse and it takes the userId of the user who posts and the image url from cloudinary then 
// the description of the post and saves it to the databse.
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



// Method which allows to fetch all the posts from the databse and it will fetch the posts in the databse
// and return it as an array with the status code and messages to identify the status from the server.
// it doesnt take any parameters beacuse it fetches all posts in the posts collection in the databse.
export const getAllPosts = (query) => {
  try {
    return new Promise((resolve, reject) => {
      Post.find(query)
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




