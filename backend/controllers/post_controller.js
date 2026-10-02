// response reusable function
const success = require("../utils/success");


// IMPORT ALL SERVICES
const postService = require("../services/post_services");

// CREATES POST CONTROLLER
const createPost = async (req, res, next) => {
    try {
        let imagePath = req.file?.path;
        let isCreated = await postService.createPostService(req.anonymousId,imagePath,req.body.text);

        if(isCreated === true){
           success(res,201,"created post suceesfully");
        };
    } catch (error) {
        next(error);
    }
};


// GETS ALL POST,LIKES AND COMMENT(REFERENCES POST ID)
const getAllPosts = async (req, res, next) => {
    try {
        const postDetails = await postService.getAllPostDetails(req.anonymousId);

        success(res,200,postDetails);
    } catch (error) {
        next(error);
    }
};

const getAPost = async (req, res, next)=>{
    try {
        const postDetail = await postService.getAPostDetail(req.anonymousId,req.params.postId);

        success(res,200,postDetail);
    } catch (error) {
        next(error);
    }
};


const delPost = async (req, res, next)=>{
    try {
        const deleted = await postService.deletePost(req.anonymousId, req.params.postId);

        if(deleted === true){
            success(res, 200, "Post deleted Successfully");
        }
    } catch (error) {
        next(error);
    }
}



module.exports = {
    createPost,
    getAllPosts,
    getAPost,
    delPost
}
