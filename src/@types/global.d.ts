import * as express from 'express';

type User = {
    user_id: string;
    email: string;
    user_name: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user: User
        }
    }
}