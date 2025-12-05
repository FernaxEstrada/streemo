import { Hono } from "hono";
import billingRouter from "./routes/billing.route";

const app = new Hono();

// Montar router (el aggregator monta este servicio en /billing)
app.route("/", billingRouter);

export default app;
