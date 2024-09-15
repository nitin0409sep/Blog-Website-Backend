import { pool } from "../../db-config/db-connection";

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
