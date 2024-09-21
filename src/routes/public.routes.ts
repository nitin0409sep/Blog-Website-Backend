import { Router } from "express";
import { getPublicPosts } from "../controllers/public/public.controller";
import { getPost } from "../controllers/public/public.controller";

const route = Router();

// Get Public Posts
route.get('/post', getPublicPosts);

// Get Public Post
route.get('/post/:id', getPost);


export { route as PublicRoute };