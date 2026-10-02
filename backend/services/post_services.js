const pool = require("../database/db");
const { badRequestError, conflictError } = require("../utils/errors");

const createPostService = async (anonymousId, imagePath, text) => {
  if (text.trim() === "") {
    throw new badRequestError("post text cant be an empty string", 400);
  }

  let create = await pool.query(
    `INSERT INTO posts (content, image_path, anonymous_id)
        VALUES ($1, $2, $3) 
        RETURNING *`,
    [text, imagePath, anonymousId],
  );

  if (create.rowCount > 0) {
    return true;
  }
};

const getAllPostDetails = async (anonymousId) => {
  const all = await pool.query(
    `
        SELECT
            p.id,
            p.content,
            p.image_path,
            p.created_at,

            COUNT(DISTINCT l.id) AS like_count,

            EXISTS (
                SELECT 1
                FROM likes ul
                WHERE ul.post_id = p.id
                AND ul.anonymous_id = $1
            ) AS has_liked,

COALESCE(
    json_agg(
        DISTINCT jsonb_build_object(
            'id', c.id,
            'content', c.content,
            'created_at', c.created_at,
            'replies', COALESCE(
                (
                    SELECT jsonb_agg(
                        jsonb_build_object(
                            'id', cr.id,
                            'content', cr.content,
                            'created_at', cr.created_at
                        )
                        ORDER BY cr.created_at ASC
                    )
                    FROM comment_replies cr
                    WHERE cr.comment_id = c.id
                    AND cr.deleted = false
                ),
                '[]'::jsonb
            )
        )
    ) FILTER (WHERE c.id IS NOT NULL),
    '[]'::json
) AS comments

        FROM posts p

        LEFT JOIN likes l
            ON l.post_id = p.id

        LEFT JOIN comments c
            ON c.post_id = p.id
            AND c.deleted = false


        LEFT JOIN comment_replies cr
        ON cr.comment_id = c.id AND 
        cr.deleted = false

        WHERE p.deleted = false

        GROUP BY p.id
        ORDER BY p.created_at DESC
        `,
    [anonymousId],
  );

  return all.rows;
};

// get a post detail
const getAPostDetail = async (anonymousId, postId) => {
  // check for post existence
  const checkPostExistence = await pool.query(
    `SELECT id FROM posts WHERE id = $1 AND deleted = false`,
    [postId],
  );

  if (checkPostExistence.rowCount == 0) {
    throw new notFoundError("Post not found", 404);
  }

  let postDetail = await pool.query(
    `
            SELECT
            p.id,
            p.content,
            p.image_path,
            p.created_at,

            COUNT(DISTINCT l.id) AS like_count,

            EXISTS (
                SELECT 1
                FROM likes ul
                WHERE ul.post_id = p.id
                AND ul.anonymous_id = $1
            ) AS has_liked,

COALESCE(
    json_agg(
        DISTINCT jsonb_build_object(
            'id', c.id,
            'content', c.content,
            'created_at', c.created_at,
            'replies', COALESCE(
                (
                    SELECT jsonb_agg(
                        jsonb_build_object(
                            'id', cr.id,
                            'content', cr.content,
                            'created_at', cr.created_at
                        )
                        ORDER BY cr.created_at ASC
                    )
                    FROM comment_replies cr
                    WHERE cr.comment_id = c.id
                    AND cr.deleted = false
                ),
                '[]'::jsonb
            )
        )
    ) FILTER (WHERE c.id IS NOT NULL),
    '[]'::json
) AS comments

        FROM posts p

        LEFT JOIN likes l
            ON l.post_id = p.id

        LEFT JOIN comments c
            ON c.post_id = p.id
            AND c.deleted = false


        LEFT JOIN comment_replies cr
        ON cr.comment_id = c.id AND 
        cr.deleted = false

        WHERE p.id = $2 AND p.deleted = false

        GROUP BY p.id
        ORDER BY p.created_at DESC
        `,
    [anonymousId, postId],
  );

  return postDetail.rows;
};



// deletig post(soft delete)
const deletePost = async (anonymousId, postId) => {
  const client = await pool.connect();
  
  try {
      // check for post existence
  const checkPostExistence = await client.query(
    `SELECT id,deleted FROM posts WHERE id = $1`,
    [postId],
  );

  if (checkPostExistence.rowCount == 0) {
    throw new notFoundError("Post not found", 404);
  }

  //   check if post have being deleted already
  if (checkPostExistence.rows[0].deleted == true) {
    throw new conflictError("post has already been deleted", 409);
  }

  await client.query("BEGIN");

  let softDelPost = await client.query(
    `UPDATE posts SET deleted = true, deleted_at = NOW()
        WHERE id = $1`,
    [postId],
  );

  let softDelComments = await client.query(
    `UPDATE comments SET deleted = true, deleted_at = NOW() WHERE
        post_id = $1 AND deleted = false`,
    [postId],
  );

  let softDelCommentReplies = await client.query(
    `UPDATE comment_replies SET deleted = true, deleted_at = NOW() WHERE
        post_id = $1 AND deleted = false`,
    [postId],
  );

  await client.query("COMMIT");

  return true;

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
  finally{
    client.release();
  }
};

module.exports = {
  createPostService,
  getAllPostDetails,
  getAPostDetail,
  deletePost
};
