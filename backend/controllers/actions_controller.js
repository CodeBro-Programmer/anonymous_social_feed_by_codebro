// response reusable function
const success = require("../utils/success");


// IMPORT ALL SERVICES
const actionService = require("../services/actions_services");

const likePost = async (req,res,next) => {
    try {
        const isLiked = await actionService.likePost(req.anonymousId,req.params.id);

        if(isLiked === true){
            success(res,201,"post liked successfully");
        }
    } catch (error) {
        next(error);
    }
};


const unlikePost = async (req,res,next)=>{
    try {
        const isUnliked = await actionService.unlikePost(req.anonymousId,req.params.id);

        if(isUnliked === true){
            success(res,200,"post unliked successfully");
        }
    } catch (error) {
        next(error);
    }
};


// COMMENT SECTION

// add comment
const addComment = async (req,res,next)=>{
    try {
       const commented = await actionService.addComment(req.anonymousId,req.body.postId,req.body.comment);
       
       if(commented === true){
        success(res,201,"comment added successfully");
       }
    } catch (error) {
        next(error);
    }
};


// delete comment
const deleteComment = async (req,res,next)=>{
    try {
        const commentDeleted = await actionService.deleteComment(req.anonymousId,req.params.commentId);

        if(commentDeleted === true){
            success(res,200,"comment deleted successfully");
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    likePost,
    unlikePost,
    addComment,
    deleteComment
}
