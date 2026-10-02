let express = require("express");
const router = express.Router();

let actionController = require("../controllers/actions_controller");

// =========================
// LIKES
// =========================

/**
 * @openapi
 * /api/actions/like/{postId}:
 *   post:
 *     summary: Like a post
 *     description: Adds an anonymous like to a post.
 *     tags:
 *       - Likes
 *
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the post to like
 *
 *     responses:
 *       201:
 *         description: Post liked successfully
 *
 *       404:
 *         description: Post not found
 *
 *       409:
 *         description: Post has already been liked
 *
 *       500:
 *         description: Internal server error
 */
router.post("/like/:postId", actionController.likePost);


/**
 * @openapi
 * /api/actions/unlike/{postId}:
 *   delete:
 *     summary: Unlike a post
 *     description: Removes the anonymous user's like from a post.
 *     tags:
 *       - Likes
 *
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the post to unlike
 *
 *     responses:
 *       200:
 *         description: Post unliked successfully
 *
 *       404:
 *         description: Post or like not found
 *
 *       500:
 *         description: Internal server error
 */
router.delete("/unlike/:postId", actionController.unlikePost);


// =========================
// COMMENTS
// =========================

/**
 * @openapi
 * /api/actions/addComment:
 *   post:
 *     summary: Add a comment
 *     description: Adds an anonymous comment to a post.
 *     tags:
 *       - Comments
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - comment
 *             properties:
 *               postId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               content:
 *                 type: string
 *                 example: "This is a great post."
 *
 *     responses:
 *       201:
 *         description: Comment added successfully
 *
 *       400:
 *         description: Invalid comment data
 *
 *       404:
 *         description: Post not found
 *
 *       500:
 *         description: Internal server error
 */
router.post("/addComment", actionController.addComment);


/**
 * @openapi
 * /api/actions/delComment/{commentId}:
 *   patch:
 *     summary: Delete a comment
 *     description: Soft deletes an anonymous comment.
 *     tags:
 *       - Comments
 *
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the comment to delete
 *
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *
 *       403:
 *         description: You are not authorized to delete this comment
 *
 *       404:
 *         description: Comment not found
 *
 *       500:
 *         description: Internal server error
 */
router.patch("/delComment/:commentId", actionController.deleteComment);


// =========================
// COMMENT REPLIES
// =========================

/**
 * @openapi
 * /api/actions/replyComment:
 *   post:
 *     summary: Reply to a comment
 *     description: Adds an anonymous reply to an existing comment.
 *     tags:
 *       - Replies
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - commentId
 *               - reply
 *             properties:
 *               commentId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               content:
 *                 type: string
 *                 example: "I agree with this."
 *
 *     responses:
 *       201:
 *         description: Reply added successfully
 *
 *       400:
 *         description: Invalid reply data
 *
 *       404:
 *         description: Comment not found
 *
 *       500:
 *         description: Internal server error
 */
router.post("/replyComment", actionController.replyComment);


/**
 * @openapi
 * /api/actions/deleteReply/{replyId}:
 *   patch:
 *     summary: Delete a reply
 *     description: Soft deletes an anonymous comment reply.
 *     tags:
 *       - Replies
 *
 *     parameters:
 *       - in: path
 *         name: replyId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the reply to delete
 *
 *     responses:
 *       200:
 *         description: Reply deleted successfully
 *
 *       403:
 *         description: You are not authorized to delete this reply
 *
 *       404:
 *         description: Reply not found
 *
 *       500:
 *         description: Internal server error
 */
router.patch("/deleteReply/:replyId", actionController.delReply);


module.exports = router;