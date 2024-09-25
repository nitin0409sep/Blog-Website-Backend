import { Request, Response } from "express"
import { asyncHandlerWithResponse } from "../../utils/asyncHandler"
import { ApiError } from "../../utils/apiErrorResponse";
import { addComments, likeComments } from "../../database/db-helper/user/comments.db.helper";
import { ApiResponse } from "../../utils/apiResponse";

// Add Comments
export const addComment = asyncHandlerWithResponse(async (req: Request, res: Response) => {
    const { user_id } = req.user;

    if (!user_id) throw new ApiError(401, "Unauthorized User");

    const { post_id, comment, is_sub_comment, parent_comment_id } = req.body;

    if (!post_id || !comment || (is_sub_comment === null)) {
        throw new ApiError(400, "Post id, Is Sub Comment and Comment are required");
    }

    if (is_sub_comment && !parent_comment_id) {
        throw new ApiError(400, "Parent comment_id is required when commenting inside a comment");
    }

    try {
        const comments = await addComments(user_id, post_id, comment, is_sub_comment, parent_comment_id);

        if (!comments)
            throw new ApiError(400, "Comment not added, please try again");

        return res.status(201).json(new ApiResponse(201, "Comment Added Successfully!!!", comments));
    } catch (error) {
        console.error('Error adding comment:', error);
        return new ApiError(500, "An unexpected error occurred");
    }
});

// Like Comments
export const likeComment = asyncHandlerWithResponse(async (req: Request, res: Response) => {
    const { user_id } = req.user;

    if (!user_id) throw new ApiError(401, "Unauthorized User");

    const { comment_id, like } = req.body;

    console.log(comment_id, like);

    if (!comment_id)
        throw new ApiError(400, "Comment id and Like are required");

    try {
        const likes = await likeComments(user_id, comment_id, like);

        if (!likes)
            throw new ApiError(400, `Comment couldn't be ${like ? 'liked' : 'unliked'}, please try again`);

        return res.status(200).json(new ApiResponse(200, `Comment ${like ? 'liked' : 'unliked'} successfully`));

    } catch (error) {
        console.error('Error liking/unliking comment:', error);
        return new ApiError(500, "An unexpected error occurred");
    }
})