import { createPost, getAllPosts } from "../helpers/postHelper";




// @desc    Create new post
// @route   POST /post/create-post
// @access  Public
export const createNewPost = (req, res, next) => {
    try {
        const postData = req.body;
        createPost(postData).then((response)=>{
            res.status(response.status).json({...response});
        }).catch((error) => {
            console.log("Error creating post (in postController): " + error);
            res.status(500).json({status: 500, error_code: "INTERNAL_SERVER_ERROR", message: "Somethings wrong, Please try after sometime."})
        });
    } catch (error) {
        console.log("Error creating post (in postController): " + error);
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
            console.log("Error fetching posts: " + error);
            res
              .status(500)
              .json({
                status: 500,
                error_code: "INTERNAL_SERVER_ERROR",
                message: "Somethings wrong, Please try after sometime."
              });
        });
    } catch (error) {
        console.log("Error fetching all posts (in postController): " + error);
    }
};