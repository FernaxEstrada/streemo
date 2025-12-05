import { Hono } from "hono";
import {
  registrarPagoPlanPHandler,
  obtenerPagosPlanPHandler,
  cambiarEstadoPagoPlanPHandler,
  actualizarNotaPagoPlanPHandler,
  registrarPagoCupoHandler,
  obtenerPagosCupoHandler,
  cambiarEstadoPagoCupoHandler,
  actualizarNotaPagoCupoHandler,
} from "../helpers/billing.handler";

const billingRouter = new Hono();

// Pagos de planes principales (solo superAdmin)
billingRouter.post("/pagos-plan", registrarPagoPlanPHandler);
billingRouter.get("/pagos-plan", obtenerPagosPlanPHandler);
billingRouter.put("/pagos-plan/estado", cambiarEstadoPagoPlanPHandler);
billingRouter.put("/pagos-plan/nota", actualizarNotaPagoPlanPHandler);

// Pagos de cupos (solo superAdmin)
billingRouter.post("/pagos-cupo", registrarPagoCupoHandler);
billingRouter.get("/pagos-cupo", obtenerPagosCupoHandler);
billingRouter.put("/pagos-cupo/estado", cambiarEstadoPagoCupoHandler);
billingRouter.put("/pagos-cupo/nota", actualizarNotaPagoCupoHandler);

export default billingRouter;
