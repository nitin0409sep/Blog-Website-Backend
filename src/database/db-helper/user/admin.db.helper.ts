import { pool } from "../../db-config/db-connection";

export const getUsers = async () => {
    try {
        const query = 'Select * from users where created_by = $1';
        const values = [1];

        const { rows } = await pool.query(query, values);

        return rows && rows.length > 0 ? rows : [];
    } catch (error: any) {
        console.log(error.message);
        throw new Error(error.message);
    }
}