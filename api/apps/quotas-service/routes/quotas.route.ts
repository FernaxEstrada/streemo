import { Hono } from "hono";
import {
  registrarCupoVendidoHandler,
  obtenerCuposVendidosHandler,
  cambiarEstadoCupoVendidoHandler,
  cambiarPlanCupoCupoVendidoHandler,
  cambiarMetodoPagoCupoVendidoHandler,
  actualizarCupoVendidoHandler,
} from "../helpers/quotas.handler";

const quotasRouter = new Hono();

// Cupos vendidos (solo superAdmin)
quotasRouter.post("/cupos-vendidos", registrarCupoVendidoHandler);
quotasRouter.get("/cupos-vendidos", obtenerCuposVendidosHandler);
quotasRouter.put("/cupos-vendidos", actualizarCupoVendidoHandler);
quotasRouter.put("/cupos-vendidos/estado", cambiarEstadoCupoVendidoHandler);
quotasRouter.put(
  "/cupos-vendidos/plan-cupo",
  cambiarPlanCupoCupoVendidoHandler
);
quotasRouter.put(
  "/cupos-vendidos/metodo-pago",
  cambiarMetodoPagoCupoVendidoHandler
);

export default quotasRouter;
