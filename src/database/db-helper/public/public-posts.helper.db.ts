import { pool } from "../../db-config/db-connection";

// Get All Public Posts
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


// Get Specific Public Post By ID
export const getPostFromDb = async (post_id: string) => {
    try {
        const query = `
        SELECT p.post_id, p.post_name, p.post_desc, p.post_article, p.img_url, u.user_name,
        jsonb_agg(DISTINCT jsonb_build_object('comment_id', cd.comment_id, 'comment', cd.comment, 'is_sub_comment', cd.is_sub_comment, 'commentsLikeCount', cd.commentsLikeCount)) AS comments,
        COUNT(DISTINCT pl.liked) AS likesCount
            FROM POSTS AS p 
                LEFT JOIN (
                    SELECT 
                        c.post_id, 
                        c.comment_id, 
                        c.comment,  
                        c.is_sub_comment, 
                        COUNT(lc.like_comment) AS commentsLikeCount 
                    FROM COMMENTS AS c 
                    LEFT JOIN LIKECOMMENT AS lc ON c.comment_id = lc.comment_id AND lc.like_comment = true
                    GROUP BY c.comment_id, c.comment, c.is_sub_comment
                ) AS cd ON p.post_id = cd.post_id
                LEFT JOIN PostLikes AS pl ON p.post_id = pl.post_id AND pl.liked = true
                LEFT JOIN USERS as u ON p.user_id = u.user_id
            WHERE p.post_id = $1 AND p.post_public = true AND p.post_archive = false
        GROUP BY p.post_id, p.post_name, p.post_desc, p.post_article, p.img_url, u.user_name;`;

        const value = [post_id];

        const { rows } = await pool.query(query, value);

        if (rows.length === 0) {
            return null; // Return null if no post is found
        }

        const { post_name, post_article, post_desc, img_url, user_name, likescount, comments } = rows[0];

        const postData = { post_name, post_desc, post_article, img_url, user_name, likescount, comments }

        return postData;
    } catch (error) {
        console.error('Error fetching post:', error);
        throw new Error("Couldn't fetch post, please try again.");
    }

}