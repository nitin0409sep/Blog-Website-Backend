import { Pool, PoolConfig } from "pg";

const poolConfig: PoolConfig = {
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: +(process.env.DBPORT ?? '5400'),

    max: 10,
    connectionTimeoutMillis: 0,
    idleTimeoutMillis: 10000,
    allowExitOnIdle: false,
}

export const pool = new Pool(poolConfig);

// IIFE
; (async () => {
    let client;

    try {
        client = await pool.connect();
        // console.log(client);
        console.log("DB Connected Successfully.")
    } catch (err) {
        console.error("Error connecting to the database:", err);
    } finally {
        if (client) {
            client.release();
        }
    }
})();

