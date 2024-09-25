import { Router } from "express"
import { getUserPosts, addUserPosts, editUserPosts, deleteUserPosts, addUpdatePostLike, getPostLikesCount } from "../controllers/user/post.controller";
import { upload } from "../middlewares/multer.middleware";
import { CommentRoute } from "./comments.route";
import { roleBasedAuthMiddleware } from "../middlewares/auth.middleware";
const route = Router();

//! Post Routes 
// Get User Posts
route.get(':post_id?', getUserPosts);

// Add User Posts
route.post('', upload.single('image'), addUserPosts);

// Edit User Posts
route.put(':post_id', editUserPosts);

// Delete User Post
route.delete(':post_id', deleteUserPosts);

//! Post Like Routes
// Get Post Likes
route.get('/likes/:post_id', getPostLikesCount);

// Add/Update Post Likes
route.post('/likes', addUpdatePostLike);

//! Comments Route
route.use('', CommentRoute);

export { route as PostRoute }