import { Response, NextFunction } from 'express';
import { ExtendedRequest } from '../utils/user.interface';
import { verify } from 'jsonwebtoken';

type Role = 'Admin' | 'User' | 'Both';

export const roleBasedAuthMiddleware = (allowedRole: Role) => {
    return (req: ExtendedRequest, res: Response, next: NextFunction) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1] ?? '';

        // Verify Token
        verify(token, process.env.ACCESS_TOKEN_SECRET ?? '', (err: any, user: any) => {
            if (err) {
                return res.status(403).json({ error: err.message });
            }

            req.user = user;

            // Role-Based Access Control
            if (allowedRole === 'Admin' && req.user?.role !== 'Admin')
                return res.status(401).json({ error: 'Unauthorized User' });


            if (allowedRole === 'User' && req.user?.role === 'Admin')
                return res.status(401).json({ error: 'Admins are not allowed to access this resource' });


            next();
        });
    };
};

