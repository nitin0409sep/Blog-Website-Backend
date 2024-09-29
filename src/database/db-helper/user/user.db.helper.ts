import { pool } from "../../db-config/db-connection"

export const getUsers = async () => {
    try {
        const query = `Select * from users`;
        const { rows } = await pool.query(query);

        return rows && rows.length > 0 ? rows : [];
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export const getUserProfileDB = async (user_id: string) => {
    try {
        const query = `Select * from users where user_id = $1`;
        const values = [user_id];

        const { rows } = await pool.query(query, values);

        const { user_name, user_email, created_at } = rows[0];
        return rows && rows.length > 0 ? { user_name, user_email, created_at } : [];
    } catch (err) {
        console.log(err);
        throw err;
    }
}