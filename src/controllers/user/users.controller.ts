import { Request, Response } from "express";
import { getUserProfileDB, getUsers } from "../../database/db-helper/user/user.db.helper";
import { ApiError } from "../../utils/apiErrorResponse";


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

export const getUserProfile = async (req: Request, res: Response) => {
    try {

        const { user_id } = req.user;

        if (!user_id) return res.status(400).json(new ApiError(400, "Invalid User"));

        const user = await getUserProfileDB(user_id);

        return res.status(200).json({ user, error: null, status: "OK" })

    } catch (err) {
        res.json({ error: err, status: 500 });
    }
}
