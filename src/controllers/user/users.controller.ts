import { Request, Response } from "express";
import { getUsers } from "../../database/db-helper/user/user.db.helper";


export const getUsersController = async (req: Request, res: Response) => {
    try {
        const users = await getUsers();

        const userData = users.map((user) => {
            const { user_name, user_email, created_at } = user;
            return { user_name, user_email, created_at };
        });

        return res.status(200).json({ users: userData, error: null, status: "OK" })

    } catch (err) {
        res.json({ error: err, status: 500 });
    }
}
