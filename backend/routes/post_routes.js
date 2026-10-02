let express = require("express");
const router = express.Router();

let multer = require("multer");

let upload = multer({dest : "uploads/"});

let postController = require("../controllers/post_controller");


/**
 * @openapi
 * /api/post/{postId}:
 *   get:
 *     summary: Get a single post
 *     description: Retrieves a specific post using its ID.
 *     tags:
 *       - Posts
 *
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *
 *       404:
 *         description: Post not found
 *
 *       500:
 *         description: Internal server error
 */
router.get("/:postId", postController.getAPost);


/**
 * @openapi
 * /api/post/delete/{postId}:
 *   patch:
 *     summary: Soft delete a post
 *     description: Soft deletes a post using its ID.
 *     tags:
 *       - Posts
 *
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to delete
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *
 *       404:
 *         description: Post not found
 *
 *       403:
 *         description: You are not authorized to delete this post
 *
 *       500:
 *         description: Internal server error
 */
router.patch("/delete/:postId", postController.delPost);


/**
 * @openapi
 * /api/post:
 *   get:
 *     summary: Get all posts
 *     description: Retrieves all available posts.
 *     tags:
 *       - Posts
 *
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 *
 *       500:
 *         description: Internal server error
 */
router.get("/", postController.getAllPosts);

/**
 * @openapi
 * /api/post/create:
 *   post:
 *     summary: Create an anonymous post
 *     description: Creates a new post for the current anonymous visitor.
 *     tags:
 *       - Posts
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.post("/create",upload.single("image"), postController.createPost);


module.exports = router;