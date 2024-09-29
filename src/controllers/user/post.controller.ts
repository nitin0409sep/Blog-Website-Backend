import { Request, Response } from "express";
import { addUserPost, deleteUserPost, editUserPost, getUserPost, upsertLikeInDb } from "../../database/db-helper/user/user-post.db.helper";
import { uploadOnCloudinary } from "../../utils/cloudinary";
import { asyncHandlerWithResponse } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiErrorResponse";
import { ApiResponse } from "../../utils/apiResponse";

// Get User Posts Controller
export const getUserPosts = async (req: Request, res: Response) => {
    const user_id: string | null = req.user!.user_id;

    if (!user_id) {
        return res.status(401).json({ posts: [], status: 401, errors: "User not found" });
    }

    const { post_id } = req.params;

    try {
        const posts = await getUserPost(user_id, post_id);

        if (!posts || posts.length === 0) {
            return res.status(200).json({ posts: [], status: 200, error: null });;
        }

        // Arranged Comments In DESC order
        if (post_id) {
            posts.comments.sort((val1: any, val2: any) => {
                const a = new Date(val1.commentTiming);
                const b = new Date(val2.commentTiming);

                return b.getTime() - a.getTime();
            });

            // fetching whether the user has already liked the comment or not
            posts?.comments?.forEach((element: any) => {
                if (element.user_liked_comment) {
                    element.user_liked_comment = true;
                } else {
                    element.user_liked_comment = false;
                }
            });
        }

        return res.status(200).json({ posts, status: 200, error: null });
    } catch (error) {
        console.error(`Error fetching posts for user_id ${user_id}:`, error);
        return res.status(500).json({ error: "An unexpected error occurred", status: 500 });
    }
};


// Add User Posts Controller
export const addUserPosts = async (req: Request, res: Response) => {
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
export const editUserPosts = async (req: Request, res: Response) => {
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
export const deleteUserPosts = async (req: Request, res: Response) => {
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


// Add/Update Post Like/Unlike
export const addUpdatePostLike = asyncHandlerWithResponse(async (req: Request, res: Response) => {
    const { user_id } = req.user;

    if (!user_id)
        return new ApiError(401, "User is not Logged In.");

    const { like, post_id } = req.body as { like: boolean, post_id: string };

    try {
        const result = await upsertLikeInDb(post_id, user_id, like);

        if (!result)
            return new ApiError(500, `Couldnt ${like ? "like" : "unlike"} the post. Please try again.`);

        return res.status(200).json(new ApiResponse(200, `${like ? "Liked" : "Unliked"} Post Successfully`));
    } catch (error) {
        if (error instanceof Error) {
            return new ApiError(500, error.message);
        } else {
            return new ApiError(500, 'An unknown error occurred.');
        }
    }
})
