import { Router } from "express";
import { getUsersController } from "../controllers/user/users.controller";
import { roleBasedAuthMiddleware } from "../middlewares/auth.middleware";
import { PostRoute } from "./posts.route";
import { getPublicPosts } from "../controllers/public/public.controller";

// Router
const route = Router();

// Get Public Posts
route.get('/post/public', getPublicPosts);

// Get ALl Users
route.get('/getUsers', roleBasedAuthMiddleware('Admin'), getUsersController);

// User Posts Routes
route.use('', roleBasedAuthMiddleware('User'), PostRoute);

export const UserRoute = route;


