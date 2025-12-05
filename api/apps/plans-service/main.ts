import { Hono } from "hono";
import plansRouter from "./routes/plans.route";

const app = new Hono();

// Montar router (el aggregator monta este servicio en /plans)
app.route("/", plansRouter);

export default app;
