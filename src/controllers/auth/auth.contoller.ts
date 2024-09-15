import { Request, Response } from "express"
import bcrypt from 'bcrypt';
import { checkUserExists, loginUser, registerUser } from '../../database/db-helper/auth/auth.db.helper';
import { jwtTokens } from '../../utils/jwt.helper';

//? LOGIN CONTROLLER
export const LoginController = async (req: Request, res: Response) => {
    try {
        // Destructure and type-check the request body
        const { email, password } = req.body as {
            email: string;
            password: string;
        };

        // Check if email and password are provided
        if (!email || !password) {
            const missingFields = [];
            if (!email) missingFields.push('email');
            if (!password) missingFields.push('password');

            return res.status(400).json({ error: `Please provide ${missingFields.join(', ')}` });
        }

        // Lowercase the email once for consistent comparison
        const normalizedEmail = email.toLowerCase();

        // Check if user exists with the provided email
        const isUser = await checkUserExists(normalizedEmail);

        // Error handling for checkUserExists
        if (!isUser) return res.status(401).json({ error: "Invalid email" });

        // Check if the provided password is valid
        const isValidPassword = await loginUser(normalizedEmail, password);

        // Handle invalid password
        if (!isValidPassword) return res.status(401).json({ error: "Invalid password" });

        // Role
        const role = isUser.role_id === 1 ? 'Admin' : 'User';

        // If everything is valid, proceed to log in the user
        const tokens = jwtTokens({ user_id: isUser.user_id, email: normalizedEmail, user_name: isUser.user_name, role_id: role });

        return res.status(200).json({ tokens });

    } catch (error) {
        console.error("Error in loginController:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}


//? REGISTER CONTROLLER 
export const RegisterController = async (req: Request, res: Response) => {
    try {
        const { user_name, email, password, role_id = 2 } = req.body as {
            user_name: string;
            email: string;
            password: string;
            role_id: number;
        };


        if (!user_name || !email || !password) {
            const missingFields = [];
            if (!user_name) missingFields.push('user name');
            if (!email) missingFields.push('email');
            if (!password) missingFields.push('password');

            return res.status(400).json({ error: `Please provide ${missingFields.join(', ')}` });
        }

        // Lowercase the email once for consistent comparison
        const normalizedEmail = email.toLowerCase();

        // Check if email already exists
        const emailExists = await checkUserExists(normalizedEmail);

        if (emailExists) return res.status(400).json({ error: "Email already exists" });

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const registered = await registerUser(user_name, normalizedEmail, hashedPassword, role_id);

            if (registered) {
                const role = registered.role_id === 1 ? 'Admin' : 'User';

                // Generate Token
                const tokens = jwtTokens({ ...registered, role_id: role });

                // Set Refresh Token's Cookie
                res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true, sameSite: 'none', secure: true })


                // Successful registered response
                return res.status(200).json({
                    message: "User registered successfully",
                    token: tokens.accessToken,
                    error: null,
                    status: "ok"
                });

            } else {
                return res.status(500).json({ error: "Failed to register user" });
            }
        }
    } catch (err) {
        return res.status(500).json({ error: `Failed to register user, ${err}` });
    }
}