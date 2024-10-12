import { Pool, PoolConfig } from "pg";

const poolConfig: PoolConfig = {
    user: process.env.PG_USER,
    host: process.env.HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: +(process.env.DBPORT ?? '5432'),

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

