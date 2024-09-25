import { pool } from '../../db-config/db-connection';

// Post Comments
export const addComments = async (user_id: string, post_id: string, comment: string, is_sub_comment: boolean, parent_comment_id: string | null) => {
    try {
        const query = `INSERT INTO COMMENTS(user_id, post_id, comment, parent_comment_id, is_sub_comment) VALUES($1, $2, $3, $4, $5) RETURNING *`;
        const values = [user_id, post_id, comment, parent_comment_id, is_sub_comment];

        const { rows } = await pool.query(query, values);

        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        // Log the actual error for debugging 
        console.error('Error while adding comments:in db', error);
        throw new Error("Couldn't add comment, please try again.");
    }
}


// Like Unlike Comment - Upsert API
export const likeComments = async (user_id: string, comment_id: string, like: boolean) => {
    try {
        const query = `
            INSERT INTO likecomment(user_id, comment_id, like_comment) VALUES($1, $2, $3) 
            ON CONFLICT (user_id, comment_id) DO UPDATE
            SET like_comment = excluded.like_comment RETURNING *`;
        const values = [user_id, comment_id, like];

        const { rows } = await pool.query(query, values);

        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        // Log the actual error for debugging 
        console.error('Error while liking/unliking for comment:in db', error);
        throw new Error("Couldn't like/unlike comment, please try again.");
    }
}