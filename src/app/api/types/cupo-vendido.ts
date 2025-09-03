import { MetodoPago } from "./metodo-pago";
import { Persona } from "./persona";
import { PlanCupo } from "./plan-cupo";
import { PlanPrincipal } from "./plan-principal";

export type CupoVendido = {
  idcupo: string;
  usuario: string;
  fechainicio: string;
  proxpago: string | null;
  nota: string | null;
  estadocupov: boolean;
};

export type CupoVendidoRaw = CupoVendido &
  Persona &
  PlanPrincipal &
  PlanCupo &
  MetodoPago;
