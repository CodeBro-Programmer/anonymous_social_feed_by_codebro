let express = require("express");
const router = express.Router();

let multer = require("multer");

let upload = multer({dest : "uploads/"});

let postController = require("../controllers/post_controller");


router.get("/:postId",postController.getAPost);
router.patch("/delete/:postId", postController.delPost);
router.get("/",postController.getAllPosts);
router.post("/create",upload.single("image"), postController.createPost);


module.exports = router;