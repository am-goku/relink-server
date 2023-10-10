//importing helpers
import { createPost, fetchUserPosts, getAllPosts } from "../helpers/postHelper";

// @desc    Create new post
// @route   POST /post/create-post
// @access  Public
export const createNewPost = (req, res, next) => {
    try {
        const postData = req.body;
        createPost(postData).then((response)=>{
            res.status(response.status).json({ ...response });
        }).catch((error) => {
            res
              .status(error.status)
              .json({
                status: 500,
                error_code: "INTERNAL_SERVER_ERROR",
                message: "Somethings wrong, Please try after sometime.",
                error_message: error.message
              });
        });
    } catch (error) {
        res
          .status(500)
          .json({
            status: 500,
            error_code: "INTERNAL_SERVER_ERROR",
            message: "Somethings wrong, Please try after sometime.",
            error_message: error.message
          });
    }
};


// @desc    Get post data
// @route   GET /post/fetch-posts
// @access  Public
export const fetchAllPosts = (req, res) => {
    try{
        let query = {};
        if(req.query.postId){
            query = { _id: req.query.postId };
        }
        getAllPosts(query).then((response)=>{
            res.status(response.status).json({...response});
        }).catch((error)=>{
            res
              .status(error.status)
              .json({
                status: 500,
                error_code: "INTERNAL_SERVER_ERROR",
                message: "Somethings wrong, Please try after sometime.",
                error_message: error.message
              });
        });
    } catch (error) {
        res.status(error.status).json({
          status: 500,
          error_code: "INTERNAL_SERVER_ERROR",
          message: "Somethings wrong, Please try after sometime.",
          error_message: error.message,
        });
    }
};



// @desc    Fetch a user's posts
// @route   GET /post/fetchUserPosts
// @access  Registerd users
export const ctrlFetchUserPosts = (req, res, next) => {
    try {
        const userId = req.query.userId;
        fetchUserPosts(userId).then((posts)=> {
            res.status(200).send({status:200, posts:posts});
        }).catch((error) => {
            res.status(error.status).send(error)
        })
    } catch (error) {
        res.status(500).send(error);
    }
};


