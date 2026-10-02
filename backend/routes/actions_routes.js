let express = require("express");
const router = express.Router();

let actionController = require("../controllers/actions_controller");

router.post("/like/:id",actionController.likePost);
router.delete("/unlike/:id",actionController.unlikePost);

router.post("/addComment",actionController.addComment);
router.patch("/delComment/:commentId",actionController.deleteComment);

module.exports = router;