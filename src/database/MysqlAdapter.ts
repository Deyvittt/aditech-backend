import dotenv from "dotenv";
import mysql from "mysql2/promise";
import { Signale } from "signale";

dotenv.config();
const signale = new Signale({ scope: "MysqlAdapter" });

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DATABASE,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
};

const pool = mysql.createPool(config);

export async function query(sql: string, params: any[]) {
    try {
        const conn = await pool.getConnection();
        signale.success("Conexión exitosa a la BD");

        const result = sql.trim().toUpperCase().startsWith('CALL')
            ? await conn.query(sql, params)
            : await conn.execute(sql, params);

        conn.release();
        return result;
    } catch (error: any) {
        signale.error(error);
        throw error;
    }
}

export class MysqlAdapter {
    async execute(sql: string, params: any[]): Promise<any> {
        try {
            const conn = await pool.getConnection();
            signale.success("Conexión exitosa a la BD");

            const [result] = sql.trim().toUpperCase().startsWith('CALL')
                ? await conn.query(sql, params)
                : await conn.execute(sql, params);

            conn.release();
            return result;
        } catch (error: any) {
            signale.error(error);
            throw error;
        }
    }
}