import { Hono } from "hono";
import {
  registrarPlanPrincipalHandler,
  obtenerPlanesPrincipalesHandler,
  actualizarPlanPrincipalHandler,
  cambiarEstadoPlanPrincipalHandler,
  cambiarMetodoPagoPlanHandler,
  cambiarTarjetaPlanHandler,
  registrarPlanCupoHandler,
  obtenerPlanesCupoHandler,
  actualizarPlanCupoHandler,
  cambiarEstadoPlanCupoHandler,
} from "../helpers/plans.handler";

const plansRouter = new Hono();

// Planes principales (solo superAdmin)
plansRouter.post("/planes-principales", registrarPlanPrincipalHandler);
plansRouter.get("/planes-principales", obtenerPlanesPrincipalesHandler);
plansRouter.put("/planes-principales", actualizarPlanPrincipalHandler);
plansRouter.put(
  "/planes-principales/estado",
  cambiarEstadoPlanPrincipalHandler
);
plansRouter.put(
  "/planes-principales/metodo-pago",
  cambiarMetodoPagoPlanHandler
);
plansRouter.put("/planes-principales/tarjeta", cambiarTarjetaPlanHandler);

// Planes cupo (solo superAdmin)
plansRouter.post("/planes-cupo", registrarPlanCupoHandler);
plansRouter.get("/planes-cupo", obtenerPlanesCupoHandler);
plansRouter.put("/planes-cupo", actualizarPlanCupoHandler);
plansRouter.put("/planes-cupo/estado", cambiarEstadoPlanCupoHandler);

export default plansRouter;
