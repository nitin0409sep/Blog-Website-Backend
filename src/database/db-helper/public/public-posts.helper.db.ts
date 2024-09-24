import { pool } from "../../db-config/db-connection";

// Get All public Posts
export const getPublicPost = async () => {
    try {
        const query = `SELECT p.*, COUNT(pl.liked) AS likescount 
    FROM posts AS p LEFT JOIN PostLikes AS pl ON p.post_id = pl.post_id AND pl.liked = true WHERE p.post_public = true AND p.post_archive = false GROUP BY p.post_id ORDER BY p.created_at DESC;`;

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
        const query = `Select p1.*, COUNT(pl.liked) AS likescount from 
        (SELECT p.post_id, p.post_name, p.post_article, p.post_desc, p.img_url, u.user_name from posts p Left JOIN users u on p.user_id = u.user_id where post_id = $1 and post_public = true AND post_archive = false) as p1 
        LEFT JOIN PostLikes AS pl ON p1.post_id = pl.post_id AND pl.liked = true 
        GROUP BY p1.post_id, p1.post_name, p1.post_article, p1.post_desc, p1.img_url, p1.user_name;`;

        const value = [id];

        const { rows } = await pool.query(query, value);

        if (rows.length === 0) {
            return null; // Return null if no post is found
        }

        const { post_name, post_article, post_desc, img_url, user_name, likescount } = rows[0];

        const postData = { post_name, post_desc, post_article, img_url, user_name, likescount }

        return postData;
    } catch (error) {
        console.error('Error fetching post:', error);
        throw new Error("Couldn't fetch post, please try again.");
    }

}