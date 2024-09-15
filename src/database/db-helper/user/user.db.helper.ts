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