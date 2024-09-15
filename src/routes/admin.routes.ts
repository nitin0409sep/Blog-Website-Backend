import { Router } from "express";
import { getUser } from "../controllers/admin/admin.controller";
import { roleBasedAuthMiddleware } from "../middlewares/auth.middleware";

const route = Router();

route.get('/userList', roleBasedAuthMiddleware("Admin"), getUser);

export { route as AdminRoute }