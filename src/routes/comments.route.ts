import { Router } from "express"
import { addComment, likeComment } from "../controllers/user/comments.controller";

const route = Router();

route.post('/comment', addComment);

route.post('/likecomment', likeComment);

export { route as CommentRoute }