import { Router } from "express";
import { RegisterController, LoginController } from "../controllers/auth/auth.contoller";

// Router
export const AuthenticationRoute = Router();

// Login
AuthenticationRoute.post('/login', LoginController);

// Register
AuthenticationRoute.post('/register', RegisterController);


