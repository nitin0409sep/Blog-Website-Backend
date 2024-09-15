import { Request } from "express";

export interface User {
    user_id: string,
    email: string,
    user_name: string,
    role: string,
}


export interface ExtendedRequest extends Request {
    user?: User;
}