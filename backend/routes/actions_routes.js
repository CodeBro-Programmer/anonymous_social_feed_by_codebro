let express = require("express");
const router = express.Router();

let actionController = require("../controllers/actions_controller");

// liking
router.post("/like/:id",actionController.likePost);
router.delete("/unlike/:id",actionController.unlikePost);

// commenting
router.post("/addComment",actionController.addComment);
router.patch("/delComment/:commentId",actionController.deleteComment);

// comment reply
router.post("/replyComment",actionController.replyComment);
router.patch("/deleteReply/:replyId", actionController.delReply);


module.exports = router;