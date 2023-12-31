//importing models
import { Comment } from "../models/commentModel.js";
import { Post } from "../models/postModel.js";
import { Report } from "../models/reportsModel.js";
import { notifyLike } from "./notificationHelper.js";


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
export const getAllPosts = (perPage, page) => {
  return new Promise((resolve, reject) => {
    try {
      Post.find({ blocked: false })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 })
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


// @desc    Fetch posts count
// @route   GET /post/fetch-count
// @access  Private
export const getPostsCount = () => {
  return new Promise((resolve, reject) => {
    try {
      Post.countDocuments({}).then((count) => {
        resolve(count);
      }).catch((err)=> {
        reject(err)
      })
    } catch (error) {
      reject(error)
    }
  })
}

// @desc    Fetch single posts
// @route   GET /post/fetch-single-post
// @access  Authenticated user
export const fetchAPost = (postId) => {
  return new Promise((resolve, reject) => {
    try {
      Post.findOne({_id: postId}).then((post) => {
        resolve(post);
      }).catch((error) =>{
        reject(error);
      })
    } catch (error) {
      reject(error);
    }
  })
}


// @desc    update post
// @route   PUT /post/update-post/:postId
// @access  registed user
export const updatePostHelper = (postId, caption) => {
  return new Promise((resolve, reject) => {
    Post.findOneAndUpdate({_id: postId}, {description: caption}, {new: true}).then(res => {
      resolve(res);
    }).catch(err => reject(err));
  })  
}



// @desc    Fetch a user's posts
// @route   GET /post/fetchUserPosts
// @access  Registerd users
export const fetchUserPosts = (userId) => {
  return new Promise ((resolve, reject) => {
    try {
      Post.find({userId: userId}).sort({createdAt: -1}).lean().then((posts)=> {
        resolve(posts);
      }).catch((err) => {
        reject(err);
      })
    } catch (error) {
      reject(error);
    }
  })
}

// @desc    Delete post
//@route    DELETE /post/delete/post/:postId
// @access  Registerd users
export const deletePostHelper = (postId) => {
  return new Promise((resolve, reject) => {
    try {
      Post.deleteOne({ _id: postId })
        .then((response) => {
          resolve(response);
          console.log(response);
        })
        .catch((err) => {
          reject({
            status: 500,
            error_code: "DB_FETCH_ERROR",
            message: err.message,
            err,
          });
        });
    } catch (error) {
      reject({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: error.message,
        error,
      });
    }
  });
};

// @desc    Like post
//@route    FETCH /post/like-post
// @access  Registerd users
export const likePostHelper = (userId, postId) => {
  return new Promise((resolve, reject) => {
    try {
      Post.findOneAndUpdate({_id: postId}, {$push: {likes: userId }}, {new: true}).then(async (response)=> {
        //notifying the like event
        await notifyLike(response, userId);
        console.log(userId);
        console.log(response);
        
        resolve(response)
      }).catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  })
}

// @desc    Unlike post
//@route    FETCH /post/unlike-post
// @access  Registerd users
export const unlikePostHelper = (userId, postId) => {
  return new Promise((resolve, reject) => {
    try {
      Post.findOneAndUpdate({_id: postId}, {$pull: {likes: userId}}, {new: true}).then((response) => {
        resolve(response);
      }).catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  })
}



// @desc    Add comment
//@route    POST /post/add-comment
// @access  Registerd users
export const addCommentHelper = (userId, postId, content) => {
  return new Promise((resolve, reject) => {
    try {
      const newComment = new Comment({
        userId: userId,
        postId: postId,
        content: content,
      });

      newComment
        .save()
        .then((response) => {
          resolve(response);
        })
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

// @desc    Delete comment
//@route    DELETE /post/delete-comment
// @access  Registerd users
export const deleteCommentHelper = (commentId) => {
  return new Promise((resolve, reject) => {
    try {
      Comment.findOneAndUpdate({_id: commentId}, {deleted: true}).then((response) => {
        resolve(response)
      }).catch((err) => reject(err))
    } catch (error) {
      reject(error)
    }
  })
}

// @desc    Get comment
//@route    GET /post/fetch-comment
// @access  Registerd users
export const fetchCommentHelper = (postId) => {
  return new Promise((resolve, reject) => {
    try {
      Comment.find({ postId: postId, deleted: false })
        .sort({ createdAt: -1 })
        .exec()
        .then((comments) => {
          const parentComments = comments.filter(comment => !comment.parentId)
          resolve(parentComments);
        })
        .catch((err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};

// @desc    Get reply comments
//@route    GET /post/comments/replies/:commentId
// @access  Registerd users
export const getReplyComments = (commentId) => {
  return new Promise((resolve, reject) => {
    try {
      Comment.find({parentId: commentId, deleted: false})
      .sort({createdAt: -1})
      .exec()
      .then((comments) => {
        resolve(comments)
      }).catch((err) => {
        reject({
          status: '500',
          error_code: "DB_FETCH_ERROR",
          message: "Error fetching comments.",
          err
        })
      })
    } catch (error) {
      reject({
        status: "500",
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching comments. Server error",
        error,
      });
    }
  })
}

// @desc    Reply comment
//@route    POST /post/comments/reply-to/:commentId
// @access  Registerd users
export const replyToComment = (data) => {
  return new Promise((resolve, reject) => {
    try {
      const newReply = new Comment({
        content: data.content,
        postId: data.postId,
        userId: data.userId,
        parentId: data.parentId,
      });

      newReply.save().then((response) => {
        resolve(response);
      }).catch((err)=> {
        reject({
          status:500,
          error_code:"DB_SAVE_ERROR",
          message: "Error replying to this comment.",
          err
        })
      })
    } catch (error) {
      reject({
        status:500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Can't replay to this comment, server error",
        error
      })
    }
  })
}

////////////////////////////////////////////////// REPORT SECTION //////////////////////////////////////////////////////////////////
// @desc    Report post
// @route   POST /post/report/post/:userId
// @access  Registerd users
export const reportPostHelper = (userId, username, targetId, details) => {
  return new Promise((resolve, reject) => {
    try {
      const newReport = new Report({
        reporterId: userId,
        targetId: targetId,
        details: details,
        reportType: "PostReport",
        reporterUsername: username
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
}





export const getEveryPost = (page) => {
  return new Promise((resolve, reject) => {
    try {
      Post.find({ blocked: false })
        .skip((page - 1) * 20)
        .limit(20)
        .sort({ createdAt: -1 })
        .exec()
        .then((posts) => {
          if (posts) {
            resolve(posts);
          } else {
            throw new Error("No posts found");
          }
        })
        .catch((err) => {
          reject({
            status: 500,
            error_code: "DB_FETCH_ERROR",
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
}