import { Hono } from "hono";
import authRouter from "./routes/auth.route";

const app = new Hono();

// Montar router (el aggregator monta este servicio en /auth)
app.route("/", authRouter);

export default app;
