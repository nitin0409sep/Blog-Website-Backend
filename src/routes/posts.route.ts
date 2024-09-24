import { Router } from "express"
import { getUserPosts, addUserPosts, editUserPosts, deleteUserPosts, addUpdatePostLike, getPostLikesCount } from "../controllers/user/post.controller";
import { upload } from "../middlewares/multer.middleware";

const route = Router();

// Get User Posts
route.get('/post/:post_id?', getUserPosts);

// Add User Posts
route.post('/post', upload.single('image'), addUserPosts);

// Edit User Posts
route.put('/post/:post_id', editUserPosts);

// Delete User Post
route.delete('/post/:post_id', deleteUserPosts);

// Get Post Likes
route.get('/likes/:post_id', getPostLikesCount);

// Add/Update Post Likes
route.post('/likes', addUpdatePostLike);

export { route as PostRoute }