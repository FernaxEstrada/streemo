import { Pool } from "pg";
import { env } from "./env";

// En producción (Vercel) muchos proveedores requieren SSL (sslmode=require).
// Localmente, mantener sin SSL para conexiones a localhost.
const isProd = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

export const db = new Pool({
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  ssl: isProd ? { rejectUnauthorized: false } : undefined,
});
