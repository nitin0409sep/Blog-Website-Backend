import { Response } from "express";
import { ExtendedRequest } from "../../utils/user.interface";
import { addUserPost, deleteUserPost, editUserPost, getUserPost } from "../../database/db-helper/user/user-post.db.helper";
import { uploadOnCloudinary } from "../../utils/cloudinary";

// Get User Posts Controller
// Get User Posts Controller
export const getUserPosts = async (req: ExtendedRequest, res: Response) => {
    const user_id: string | null = req.user!.user_id;

    if (!user_id) {
        return res.status(401).json({ posts: [], status: 401, errors: "User not found" });
    }

    try {
        const posts = await getUserPost(user_id);

        if (!posts || posts.length === 0) {
            return res.status(404).json({ error: "No posts found", status: 404 });
        }

        const response = posts.map((post) => ({
            post_id: post.post_id,
            post_name: post.post_name,
            post_desc: post.post_desc,
            post_article: post.post_article,
            img_url: post.img_url,
        }));

        return res.status(200).json({ posts: response, status: 200, error: null });
    } catch (error) {
        console.error(`Error fetching posts for user_id ${user_id}:`, error);
        return res.status(500).json({ error: "An unexpected error occurred", status: 500 });
    }
};


// Add User Posts Controller
export const addUserPosts = async (req: ExtendedRequest, res: Response) => {
    const user_id: string | null = req.user?.user_id ?? null;

    if (!user_id) {
        return res.status(401).json({ posts: [], status: 401, errors: "User not found" });
    }

    const { post_name, post_desc, post_article, post_public = false } = req.body;

    const errors: string[] = [];

    const imageLocalPath = req.file?.path

    if (!post_name || !post_article || !post_desc || !imageLocalPath) {
        if (!post_name) errors.push("Post Name");
        if (!post_article) errors.push("Post Article");
        if (!post_desc) errors.push("Post Desc");
        if (!imageLocalPath) errors.push("Image");

        return res.status(400).json({ errors: `${errors.join(', ')} not found` });
    }


    const imageUrl = await uploadOnCloudinary(imageLocalPath);

    if (!imageUrl) {
        return res.status(400).json({ errors: "Image not found" });
    }

    try {
        const post = await addUserPost(user_id, post_name, post_desc, post_article, post_public, imageUrl.url);

        if (!post) {
            return res.status(500).json({ error: "Post couldn't be added, please try again", status: 500 });
        }

        return res.status(200).json({ message: "Post added successfully", status: 200, error: null });
    } catch (error) {
        console.error('Error Adding Post:', error);
        return res.status(500).json({ error: "An unexpected error occurred", status: 500 });
    }
};


// Edit User Post Controller
export const editUserPosts = async (req: ExtendedRequest, res: Response) => {
    const user_id: string | null = req.user?.user_id ?? null;
    const { post_id } = req.params as { post_id: string | null };

    if (!user_id) {
        return res.status(401).json({ posts: [], status: 401, errors: "User not found" });
    }

    if (!post_id) {
        return res.status(401).json({ posts: [], status: 401, errors: "Post id not found" });
    }

    const { post_name, post_desc, post_article = "", post_public = false, img_url } = req.body;

    const errors: string[] = [];

    if (!post_name || !post_desc || !img_url) {
        if (!post_name) errors.push("Post Name");
        if (!post_desc) errors.push("Post Desc");
        if (!img_url) errors.push("Image");

        return res.status(400).json({ errors: `${errors.join(', ')} not found` });
    }

    try {
        const post = await editUserPost(user_id, post_name, post_desc, post_article, post_public, img_url, post_id);

        if (!post) {
            return res.status(500).json({ error: "Post couldn't be edited, please try again", status: 500 });
        }

        return res.status(200).json({ message: "Post edited successfully", status: 200, error: null });
    } catch (error) {
        console.error('Error Editing Post:', error);
        return res.status(500).json({ error: "An unexpected error occurred", status: 500 });
    }
}

// Delete User Post Controller
export const deleteUserPosts = async (req: ExtendedRequest, res: Response) => {
    const user_id: string | null = req.user?.user_id ?? null;
    // const { post_id } = req.query; // Accessing post_id from query params
    const { post_id } = req.params; // URL Param

    if (!user_id) {
        return res.status(401).json({ posts: [], status: 401, errors: "User not found" });
    }

    try {
        const post = await deleteUserPost(user_id, post_id);

        if (!post) {
            return res.status(500).json({ error: "Post couldn't be deleted, please try again", status: 500 });
        }

        return res.status(200).json({ message: "Post Deleted Successfully", status: 200, error: null });
    } catch (error) {
        console.error('Error Deleting Post:', error);
        return res.status(500).json({ error: "An unexpected error occurred", status: 500 });
    }
};
