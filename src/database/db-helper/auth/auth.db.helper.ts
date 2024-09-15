import { pool } from "../../db-config/db-connection";
import bcrypt from 'bcrypt';

// CHECK USER ALREADY EXISTS OR NOT
export const checkUserExists = async (email: string) => {
    try {
        const query = 'SELECT * FROM users WHERE user_email = $1';
        const { rows } = await pool.query(query, [email]);
        return rows[0] ?? false;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

// LOGIN USER
export const loginUser = async (email: string, password: string) => {
    try {
        const query = 'Select * from users where user_email = $1'
        const { rows } = await pool.query(query, [email]);

        // Validate Password
        const validPassword = await bcrypt.compare(password, rows[0].user_password);

        return validPassword ? true : false;

    } catch (err) {
        throw err;
    }
}

// REGISTER USERS
export const registerUser = async (user_name: string, email: string, password: string, role_id: number) => {
    try {
        const query = `INSERT INTO USERS(user_name, user_email, user_password, role_id) VALUES($1, $2, $3, $4) RETURNING *`;
        const result = await pool.query(query, [user_name, email, password, role_id]);

        // Check if the insertion was successful
        return (result?.rowCount ?? 0) > 0 ? result.rows[0] : false;
    } catch (error) {
        console.log(error);
        throw error;
    }
}