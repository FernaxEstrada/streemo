import { MetodoPago } from "./metodo-pago";
import { Persona } from "./persona";
import { Tarjeta } from "./tarjeta";

export type PlanPrincipal = {
  idplanp: string;
  nombreplan: string;
  correo: string;
  fechainicio: string;
  costo: number;
  proxpago: string | null;
  direccionplan: string;
  estadoplanp: boolean;
};

export type PlanPrincipalRaw = PlanPrincipal & Persona & MetodoPago & Tarjeta;
