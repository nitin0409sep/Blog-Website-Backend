import { asyncHandlerWithResponse } from "../../../utils/asyncHandler";
import { pool } from "../../db-config/db-connection";

// Get Users ALL posts
export const getUserPost = async (user_id: string, post_id?: string) => {
    try {
        let query;
        let values;

        // Get single Post or all Posts based on post_id
        if (post_id) {
            query = `SELECT post_id, post_name, post_desc, post_article, img_url 
                     FROM posts 
                     WHERE user_id = $1 AND post_archive = false AND post_id = $2`;
            values = [user_id, post_id];
        } else {
            query = `SELECT post_id, post_name, post_desc, post_article, img_url 
                     FROM posts 
                     WHERE user_id = $1 AND post_archive = false 
                     ORDER BY created_at DESC`;
            values = [user_id];
        }

        const { rows } = await pool.query(query, values);

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

// Like - Get Count of likes on Post
export const getLikesCount = async (post_id: string) => {
    try {
        const query = `SELECT COUNT(*) FROM PostLikes WHERE post_id = $1 AND liked = true;`;
        const values = [post_id];
        const { rows } = await pool.query(query, values);

        return { like_count: parseInt(rows[0].count ?? 0, 10) };
    } catch (error) {
        console.error('Error in Get Likes From Db', error);
        throw new Error('Something went wrong');
    }
}


// try {
//     const query = `SELECT COUNT(*) FROM PostLikes WHERE post_id = $1 AND liked = true;`;
//     const values = [post_id];
//     const { rows } = await pool.query(query, values);

//     return rows[0].count; // Just return the count
// } catch (error) {
//     // console.error('Error in getLikesCount:', error.message); // Log the error message
//     throw new Error('Something went wrong');
// }

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