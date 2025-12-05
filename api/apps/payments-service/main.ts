import { Hono } from "hono";
import paymentsRouter from "./routes/payments.route";

const app = new Hono();

// Montar router (el aggregator monta este servicio en /payments)
app.route("/", paymentsRouter);

export default app;
