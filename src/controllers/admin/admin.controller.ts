import { Request, Response } from "express"
import { getUsers } from "../../database/db-helper/user/admin.db.helper";

export const getUser = async (req: Request, res: Response) => {
    try {
        const data = await getUsers();

        if (!data)
            return res.status(500).json({ data: [], error: "Couldn't fetch users list.", status: 500 })

        if (data && data.length > 0) {
            const users = data.map((val) => {
                return {
                    name: val.user_name,
                    email: val.user_email,
                    created_at: val.created_at
                }
            })

            return res.status(200).json({ users, error: [], staus: 200 })
        }

    } catch (error: any) {
        console.log(error.message)
        return res.status(500).json({ data: [], error: "Something Went Wrong", status: 500 })
    }
}