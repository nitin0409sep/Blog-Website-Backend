import { Response } from "express";
import { ExtendedRequest } from "../../utils/user.interface";
import { getPublicPost } from "../../database/db-helper/public/public-posts.helper.db";

export const getPublicPosts = async (req: ExtendedRequest, res: Response) => {
    try {
        const posts = await getPublicPost();

        if (!posts || posts.length === 0) {
            return res.status(404).json({ posts: [], error: "No public posts found", status: 404 });
        }

        const response = posts.map((post) => ({
            post_id: post.post_id,
            post_name: post.post_name,
            post_desc: post.post_desc,
            post_article: post.post_article,
            img_url: post.img_url,
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
