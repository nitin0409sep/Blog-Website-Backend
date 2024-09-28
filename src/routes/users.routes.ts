import { Router } from "express";
import { getUserProfile, getUsersController } from "../controllers/user/users.controller";
import { roleBasedAuthMiddleware } from "../middlewares/auth.middleware";
import { PostRoute } from "./posts.route";

// Router
const route = Router();

// Get User Profile
route.get('/userProfile', roleBasedAuthMiddleware('User'), getUserProfile);

// User Posts Routes
route.use('/post', roleBasedAuthMiddleware('User'), PostRoute);

export const UserRoute = route;


