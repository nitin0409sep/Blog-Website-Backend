import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

export const isUserMiddleware = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1] ?? '';

        if (!token)
            return next();

        verify(token, process.env.ACCESS_TOKEN_SECRET ?? '', (err: any, user: any) => {
            if (err)
                return res.status(403).json({ error: err.message });

            req.user = user;
        });

        next();
    };
};

