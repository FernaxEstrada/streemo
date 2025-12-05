import "dotenv/config";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import {
  apiResponse,
  apiResponseError,
  AppError,
  ErrorCodes,
} from "@packages/common-http";
import { getPool } from "@packages/db";
import authService from "../auth-service/main";
import paymentsService from "../payments-service/main";
import plansService from "../plans-service/main";
import quotasService from "../quotas-service/main";
import billingService from "../billing-service/main";

const app = new Hono();

app.use("*", logger());

// CORS
if (!process.env.CORS_ORIGIN) {
  console.error("[ERROR] CORS_ORIGIN no esta definido");
  process.exit(1);
}

app.use(
  "*",
  cors({
    origin: process.env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Health check
app.get("/health", (c) =>
  apiResponse(
    { response: c },
    { data: "API | Streemo", error: null, ok: true },
    { status: 200 }
  )
);

// Ping check
app.get("/ping", async (c) => {
  try {
    await getPool().query("select 1 as ok");
    return apiResponse(
      { response: c },
      { data: { ok: true }, error: null, ok: true },
      { status: 200 }
    );
  } catch (err: any) {
    return apiResponseError(c, err);
  }
});

// Montar servicios
app.route("/auth", authService);
app.route("/payments", paymentsService);
app.route("/plans", plansService);
app.route("/quotas", quotasService);
app.route("/billing", billingService);

// 404
app.notFound((c) =>
  apiResponseError(
    c,
    new AppError(
      ErrorCodes.NOT_FOUND,
      "No estas autorizado para acceder a este recurso"
    )
  )
);

// Validar PORT
if (!process.env.PORT) {
  console.error("[ERROR] PORT no esta definido");
  process.exit(1);
}

const port = parseInt(process.env.PORT);
console.log(`[SERVER] API | Streemo iniciado en puerto: ${port}`);

serve({
  fetch: app.fetch,
  port,
});

export default app;
