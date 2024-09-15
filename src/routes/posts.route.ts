import { Router } from "express"
import { getUserPosts, addUserPosts, editUserPosts, deleteUserPosts } from "../controllers/user/post.controller";
import { upload } from "../middlewares/multer.middleware";

const route = Router();

// Get User Posts
route.get('/post', getUserPosts);

// Add User Posts
route.post('/post', upload.single('image'), addUserPosts);

// Edit User Posts
route.put('/post/:post_id', editUserPosts);

// Delete User Post
route.delete('/post/:post_id', deleteUserPosts);

export { route as PostRoute }