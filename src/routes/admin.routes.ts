import { Router } from "express";
import { getUser } from "../controllers/admin/admin.controller";
import { roleBasedAuthMiddleware } from "../middlewares/auth.middleware";
import { getUsersController } from "../controllers/user/users.controller";

const route = Router();

// Get ALl Users
route.get('/getUsers', roleBasedAuthMiddleware('Admin'), getUsersController);

route.get('/userList', roleBasedAuthMiddleware("Admin"), getUser);

export { route as AdminRoute }