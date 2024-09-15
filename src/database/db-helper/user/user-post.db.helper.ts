import { pool } from "../../db-config/db-connection";

// Get Users ALL posts
export const getUserPost = async (user_id: string) => {
    try {
        const query = `Select post_name, post_desc, post_article, img_url from posts where user_id = $1 and post_archive = false order by created_at DESC`;
        const values = [user_id];

        const { rows } = await pool.query(query, values);

        return rows.length ? rows : null;
    } catch (err) {
        console.error('Error Getting User Post:', err);
        throw new Error("Couldn't get post, please try again.");
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
        const query = `DELETE FROM posts WHERE user_id = $1 AND post_id = $2 RETURNING *`;
        const values = [user_id, post_id];

        const { rows } = await pool.query(query, values);

        return rows.length ? rows[0] : null;
    } catch (err) {
        console.error('Error Deleting User Post:', err);
        throw new Error("Couldn't delete post, please try again.");
    }
};