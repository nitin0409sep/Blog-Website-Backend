import { Router } from "express";
import { getUsersController } from "../controllers/user/users.controller";
import { roleBasedAuthMiddleware } from "../middlewares/auth.middleware";
import { PostRoute } from "./posts.route";

// Router
const route = Router();

// Get ALl Users
route.get('/getUsers', roleBasedAuthMiddleware('Admin'), getUsersController);

// User Posts Routes
route.use('/post', roleBasedAuthMiddleware('User'), PostRoute);

export const UserRoute = route;


