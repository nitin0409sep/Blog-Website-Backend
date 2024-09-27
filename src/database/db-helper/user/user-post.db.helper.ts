import { pool } from "../../db-config/db-connection";

// Get Users ALL posts
export const getUserPost = async (user_id: string, post_id?: string) => {
    try {
        let query;
        let values;

        // Get single Post or all Posts based on post_id
        if (post_id) {
            query = `
                    SELECT p.post_id, p.post_name, p.post_desc, p.post_article, p.img_url, u.user_name,
                    jsonb_agg(DISTINCT jsonb_build_object('comment_id', cd.comment_id, 'comment', cd.comment, 'is_sub_comment', cd.is_sub_comment, 'commentsLikeCount', cd.commentsLikeCount)) AS comments,
                    COUNT(DISTINCT pl.liked) AS likesCount
                    FROM POSTS AS p LEFT JOIN (
                    SELECT 
                            c.user_id,
                            c.post_id, 
                            c.comment_id, 
                            c.comment,  
                            c.is_sub_comment, 
                            COUNT(LC.like_comment) AS commentsLikeCount 
                        FROM COMMENTS AS c 
                        LEFT JOIN LIKECOMMENT AS lc ON c.comment_id = lc.comment_id AND lc.like_comment = true
                        GROUP BY c.comment_id, c.comment, c.is_sub_comment, c.user_id
                    ) AS cd ON p.post_id = cd.post_id
                    LEFT JOIN PostLikes AS pl ON p.post_id = pl.post_id AND pl.liked = true
                    LEFT JOIN USERS as u on p.user_id = u.user_id
                    WHERE p.user_id = $1 AND p.post_archive = false AND p.post_id = $2
                    GROUP BY p.post_id, p.post_name, p.post_desc, p.post_article, p.img_url, u.user_id, u.user_name;            
            `;

            values = [user_id, post_id];
        } else {
            query = `SELECT p.post_id, p.post_name, p.post_desc, p.post_article, p.img_url, Count(pl.liked) as likesCount
                     FROM posts AS p LEFT JOIN PostLikes AS pl ON p.post_id = pl.post_id AND pl.liked = true
                     WHERE p.user_id = $1 AND p.post_archive = false GROUP BY p.post_id, p.post_name, p.post_desc, p.post_article, p.img_url ORDER BY p.created_at DESC`;
            values = [user_id];
        }

        let { rows } = await pool.query(query, values);

        // User has already liked the post or not
        query = `SELECT * FROM LIKECOMMENT AS lc WHERE lc.user_id = '${user_id}'`;
        const user_like = await pool.query(query);

        rows[0].user_like = user_like.rows.length ? true : false;

        // Check if rows are returned, otherwise return null
        return rows.length ? rows : null;

    } catch (err) {
        // Log the actual error for debugging
        console.error('Error Getting User Post:', err);

        // Throw a user-friendly error message
        throw new Error("Couldn't get post, please try again later.");
    }
};

// Add Users Post
export const addUserPost = async (user_id: string, post_name: string, post_desc: string, post_article: string, post_public: boolean, img_url: string) => {
    try {
        const query = `
            INSERT INTO posts (user_id, post_name, post_desc, post_article, post_public, img_url)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [user_id, post_name, post_desc, post_article, post_public, img_url];

        const { rows } = await pool.query(query, values);

        return rows.length ? rows[0] : null;
    } catch (err) {
        console.error('Error Adding User Post:', err);
        throw new Error("Couldn't add post, please try again.");
    }
};

// Edit User Posts
export const editUserPost = async (
    user_id: string,
    post_name: string,
    post_desc: string,
    post_article: string,
    post_public: boolean,
    img_url: string,
    post_id: string
) => {
    try {
        const query = `
            UPDATE POSTS 
            SET post_name = $1, 
                post_desc = $2, 
                post_article = $3, 
                post_public = $4, 
                img_url = $5 
            WHERE user_id = $6 
            AND post_id = $7 
            RETURNING *;
        `;

        const values = [post_name, post_desc, post_article, post_public, img_url, user_id, post_id];

        const { rows } = await pool.query(query, values);

        return rows.length === 0 ? null : rows[0];
    } catch (err) {
        console.error('Error while Editing User Post:', err);
        throw new Error("Couldn't edit post, please try again.");
    }
};


// Delete Users Post
export const deleteUserPost = async (user_id: string, post_id: string) => {
    try {
        const query = `UPDATE POSTS SET post_archive = true WHERE user_id = $1 AND post_id = $2 RETURNING *`;
        const values = [user_id, post_id];

        const { rows } = await pool.query(query, values);

        return rows.length ? rows[0] : null;
    } catch (err) {
        console.error('Error Deleting User Post:', err);
        throw new Error("Couldn't delete post, please try again.");
    }
};

// Add/Update Likes of Post
export const upsertLikeInDb = async (post_id: string, user_id: string, like: boolean): Promise<any> => {
    try {
        const query = `
                INSERT INTO PostLikes (user_id, post_id, liked)
                VALUES ($1, $2, $3)
                ON CONFLICT (user_id, post_id) DO UPDATE
                SET liked = excluded.liked
                RETURNING *`;
        const values = [user_id, post_id, like];
        const { rows } = await pool.query(query, values);

        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error in upsertLikeInDb:', error);
        throw new Error('Something went wrong');
    }
};

// Using excluded: Updates the column to the new value from the insert.
// Not using excluded: Keeps the existing value unchanged, as it effectively does nothing to modify the current row.