import { Hono } from "hono";
import {
  registrarMetodoPagoHandler,
  obtenerMetodosPagoHandler,
  actualizarMetodoPagoHandler,
  registrarTarjetaHandler,
  obtenerTarjetasHandler,
  actualizarEstadoTarjetaHandler,
} from "../helpers/payments.handler";

const paymentsRouter = new Hono();

// Métodos de pago (solo superAdmin)
paymentsRouter.post("/metodos-pago", registrarMetodoPagoHandler);
paymentsRouter.get("/metodos-pago", obtenerMetodosPagoHandler);
paymentsRouter.put("/metodos-pago", actualizarMetodoPagoHandler);

// Tarjetas (solo superAdmin)
paymentsRouter.post("/tarjetas", registrarTarjetaHandler);
paymentsRouter.get("/tarjetas", obtenerTarjetasHandler);
paymentsRouter.put("/tarjetas/estado", actualizarEstadoTarjetaHandler);

export default paymentsRouter;
