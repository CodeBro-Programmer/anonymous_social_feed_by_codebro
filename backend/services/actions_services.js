const pool = require("../database/db");
const {
  notFoundError,
  conflictError,
  badRequestError,
} = require("../utils/errors");


// LIKE POST
const likePost = async (anonymousId, postId) => {
  let isPostIdFound = await pool.query(`SELECT id FROM posts WHERE id = $1 AND deleted = false`, [
    postId,
  ]);

  if (isPostIdFound.rowCount == 0) {
    throw new notFoundError("Post not found", 404);
  }

  let checkIfAlreadyLiked = await pool.query(
    `SELECT id FROM likes WHERE anonymous_id = $1 AND post_id = $2`,
    [anonymousId, postId],
  );

  if (checkIfAlreadyLiked.rowCount > 0) {
    throw new conflictError("You have already liked this post.", 409);
  }

  let createLikeRecord = await pool.query(
    `INSERT INTO likes (
        anonymous_id,
        post_id
        )
        VALUES ($1, $2)
        RETURNING *`,
    [anonymousId, postId],
  );

  if (createLikeRecord.rowCount > 0) {
    return true;
  }
};


// UNLIKE POST
const unlikePost = async (anonymousId, postId) => {
  // check for post existence
  const checkPostExistence = await pool.query(
    `SELECT id FROM posts WHERE id = $1 AND deleted = false`,
    [postId],
  );

  if (checkPostExistence.rowCount == 0) {
    throw new notFoundError("Post not found", 404);
  }

  const deleteLikeRecord = await pool.query(
    `DELETE FROM likes
     WHERE post_id = $1
     AND anonymous_id = $2
     RETURNING id`,
    [postId, anonymousId],
  );

  if (deleteLikeRecord.rowCount === 0) {
    throw new notFoundError("You did not like this post", 404);
  } else {
    return true;
  }
};

// COMMENT ON POST
const addComment = async (anonymousId, postId, comment) => {
  console.log(postId);
  // check for post existence
  const checkPostExistence = await pool.query(
    `SELECT id FROM posts WHERE id = $1 AND deleted = false`,
    [postId],
  );

  if (checkPostExistence.rowCount == 0) {
    throw new notFoundError("Post not found", 404);
  }

  if (!comment) {
    throw new badRequestError("Your comment can be an empty or null", 400);
  }

  const addNewComment = await pool.query(
    `INSERT INTO comments (
    post_id,
    anonymous_id,
    content
    )
    VALUES ($1, $2, $3)
    RETURNING id`,
    [postId, anonymousId, comment],
  );

  if (addNewComment.rowCount > 0) {
    return true;
  }
};

// delete comment(soft delete,reason: for record keeping)
const deleteComment = async (anonymousId, commentId) => {
  // check if comment exists
  const isCommentExists = await pool.query(
    `SELECT id FROM comments WHERE id = $1 AND anonymous_id = $2`,
    [commentId, anonymousId],
  );

  if (isCommentExists.rowCount === 0) {
    throw new notFoundError("Comment not found", 404);
  }

  // check if deleted
  const isDeleted = await pool.query(
    `SELECT id FROM comments WHERE id = $1 AND deleted = true AND anonymous_id = $2`,
    [commentId,anonymousId]
  );

  console.log(isDeleted.rowCount);

  if (isDeleted.rowCount > 0) {
    throw new conflictError("comment has been deleted already", 409);
  } else {
    // soft delete it
    const softDelComment = await pool.query(
      `UPDATE comments
         SET deleted = true,deleted_at = NOW() 
         WHERE id = $1 AND anonymous_id = $2
         RETURNING *`,
      [commentId, anonymousId],
    );

    if (softDelComment.rowCount > 0) {
      return true;
    }
  }
};

module.exports = {
  likePost,
  unlikePost,
  addComment,
  deleteComment
};
