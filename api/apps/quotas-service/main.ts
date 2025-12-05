import { Hono } from "hono";
import quotasRouter from "./routes/quotas.route";

const app = new Hono();

// Montar router (el aggregator monta este servicio en /quotas)
app.route("/", quotasRouter);

export default app;
