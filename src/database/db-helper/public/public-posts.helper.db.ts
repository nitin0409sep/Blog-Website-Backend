import { pool } from "../../db-config/db-connection";

// Get All public Posts
export const getPublicPost = async () => {
    try {
        const query = 'SELECT * FROM posts WHERE post_public = true AND post_archive = false order by created_at DESC';
        const { rows } = await pool.query(query);

        // Return the rows or an empty array if no posts are found
        return rows.length ? rows : [];

    } catch (err) {
        // Log the actual error for debugging (optional)
        console.error('Error fetching public posts:', err);
        throw new Error("Couldn't fetch posts, please try again.");
    }
}


// Get Public Post
export const getPostFromDb = async (id: string) => {
    try {
        const query = 'SELECT p.post_name, p.post_article, p.post_desc, p.img_url, u.user_name from posts p JOIN users u on p.user_id = u.user_id where post_id = $1 and post_public = true AND post_archive = false';

        const value = [id];

        const { rows } = await pool.query(query, value);

        if (rows.length === 0) {
            return null; // Return null if no post is found
        }

        const { post_name, post_article, post_desc, img_url, user_name } = rows[0];

        const postData = { post_name, post_desc, post_article, img_url, user_name }

        return postData;
    } catch (error) {
        console.error('Error fetching post:', error);
        throw new Error("Couldn't fetch post, please try again.");
    }

}