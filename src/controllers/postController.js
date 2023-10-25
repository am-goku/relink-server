//importing helpers
import { response } from "express";
import { addCommentHelper, createPost, deleteCommentHelper, deletePostHelper, fetchAPost, fetchCommentHelper, fetchUserPosts, getAllPosts, getPostsCount, likePostHelper, reportPostHelper, unlikePostHelper } from "../helpers/postHelper";

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
              .status(500)
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


// @desc    Fetch single posts
// @route   GET /post/fetch-single-post
// @access  Authenticated user
export const fetchSinglePost = (req, res) => {
    try {
        const {postId} = req.params;
        fetchAPost(postId).then((response) => {
            res.status(200).send(response);
        }).catch((error) => {
            res.status(500).send(error)
        })
    } catch (error) {
        res.status(500).send(error);
    }
};


// @desc    Get post data
// @route   GET /post/fetch-posts
// @access  Public
export const fetchAllPosts = (req, res) => {
    try{
        const perPage = 5, page = req.query.page || 1;
        getAllPosts(perPage, page).then((response)=>{
            res.status(response.status).json(response);
        }).catch((error)=>{
            res
              .status(500)
              .json({
                status: 500,
                error_code: "INTERNAL_SERVER_ERROR",
                message: "Somethings wrong, Please try after sometime.",
                error_message: error.message
              });
        });
    } catch (error) {
        res.status(500).json({
          status: 500,
          error_code: "INTERNAL_SERVER_ERROR",
          message: "Somethings wrong, Please try after sometime.",
          error_message: error.message,
        });
    }
};

// @desc    Fetch posts count
// @route   GET /post/fetch-count
// @access  Private
export const getPostsCountController = (req, res) => {
    try {
        getPostsCount().then((count)=> {
            res.status(200).send(count);
        }).catch((error) => {
            res.status(500).json(error)
        })
    } catch (error) {
        res.status(500).json(error);
    }
}



// @desc    Fetch a user's posts
// @route   GET /post/fetchUserPosts
// @access  Registerd users
export const ctrlFetchUserPosts = (req, res, next) => {
    try {
        const userId = req.query.userId;
        fetchUserPosts(userId).then((posts)=> {
            res.status(200).send({status:200, posts:posts});
        }).catch((error) => {
            res.status(500).send(error)
        })
    } catch (error) {
        res.status(500).send(error);
    }
};

// @desc    Delete post
//@route    DELETE /post/delete/post/:postId
// @access  Registerd users
export const deletePost = (req, res) => {
  try {
    const { postId } = req.params;
    deletePostHelper(postId)
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




// @desc    Like post
//@route    FETCH /post/like-post
// @access  Registerd users
export const likePost = (req, res) => {
    try {
        const {postId, userId} = req.body;
        likePostHelper(userId, postId).then((response) => {
            res.status(200).send(response);
        }).catch((error) => {
            res.status(500).send(error);
        })
    } catch (error) {
        res.status(500).send(error);
    }
};

// @desc    Unlike a post
//@route    FETCH /post/unlike-post
// @access  Registerd users
export const unlikePost = (req, res) => {
    try {
        const {postId, userId} = req.body;
        unlikePostHelper(userId, postId).then((response) => {
            res.status(200).send(response);
        }).catch((error) => {
            res.status(500).send(error);
        })
    } catch (error) {
        res.status(500).send(error);
    }
};



// @desc    Comment a post
//@route    POST /post/add-comment
// @access  Registerd users
export const addComment = (req, res) => {
    try {
        const {userId, postId, content} = req.body;
        addCommentHelper(userId, postId, content).then((response)=> {
            res.status(200).send(response);
        }).catch((error)=> {
            res.status(500).send(error);
        })
    } catch (error) {
        res.status(500).send(error);
    }
};

// @desc    Delete comment
//@route    DELETE /post/delete-comment
// @access  Registerd users
export const deleteComment = (req, res) => {
    try {
        const {commentId} = req.body;
        deleteCommentHelper(commentId).then((response) => {
            res.status(200).send(response);
        }).catch((error) => {
            res.status(500).send(error);
        })
    } catch (error) {
        res.status(500).send(error);
    }
};

// @desc    Get comment
//@route    GET /post/fetch-comment
// @access  Registerd users
export const fetchComment = (req, res) => {
    try {
        const {postId} = req.params;
        fetchCommentHelper(postId).then((comments) => {
            res.status(200).send(comments);
        }).catch((error) => {
            res.status(500).send(error);
        })
    } catch (error) {
        res.status(500).send(error);
    }
};



////////////////////////////////////////////////// REPORT SECTION //////////////////////////////////////////////////////////////////

// @desc    Report user
// @route   POST /post/report/post/:userId
// @access  Registerd users
export const reportPost = (req, res) => {
  try {
    const {userId, username} = req.params;
    const {targetId, details} = req.body;
    reportPostHelper(userId, username, targetId, details).then((response)=> {
      res.status(200).send(response)
    }).catch((err)=> {
      res.status(500).send(err)
    })
  } catch (error) {
    res.status(500).send(error);
  }
}