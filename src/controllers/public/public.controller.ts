import { Response, Request } from "express";
import { getPublicPost } from "../../database/db-helper/public/public-posts.helper.db";
import { getPostFromDb } from '../../database/db-helper/public/public-posts.helper.db';

// Get All Posts
export const getPublicPosts = async (req: Request, res: Response) => {
    try {
        const posts = await getPublicPost();

        if (!posts || posts.length === 0) {
            return res.status(200).json({ posts: [], message: "No public posts found", status: 200 });
        }

        const response = posts.map((post) => ({
            post_id: post.post_id,
            post_name: post.post_name,
            post_desc: post.post_desc,
            post_article: post.post_article,
            img_url: post.img_url,
            likescount: post.likescount,
        }));

        res.status(200).json({ posts: response, status: 200, error: null });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error fetching public posts:', error.message);
            res.status(500).json({ posts: [], error: error.message, status: 500 });
        } else {
            console.error('Unknown error occurred:', error);
            res.status(500).json({ posts: [], error: 'An unexpected error occurred', status: 500 });
        }
    }
};

// Get Post
export const getPost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let user_id = undefined;

        if (req?.user?.user_id)
            user_id = req.user.user_id;

        if (!id)
            return res.status(400).json({ error: "Please provide post id." })

        const posts = await getPostFromDb(id, user_id);

        if (!posts)
            return res.status(404).json({ error: "Post not found." });

        // Arranged Comments In DESC order
        posts.comments.sort((val1: any, val2: any) => {
            const a = new Date(val1.commentTiming);
            const b = new Date(val2.commentTiming);

            return b.getTime() - a.getTime();
        });

        return res.status(200).json({ posts, error: null, status: 200 })
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error in getPost:", error.message);
            return res.status(500).json({ error: error.message, message: "Something went wrong!!!" });
        } else {
            console.error("Unexpected error:", error);
            return res.status(500).json({ error: "Unexpected error occurred" });
        }
    }

}