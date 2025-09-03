import { PlanPrincipalRaw } from "./plan-principal";

export type PagoPlan = {
  idpagoplan: string;
  fechafacturacion: string;
  fechapago: string;
  monto: number;
  metodopago: string;
  tarjeta: string;
  nota: string | null;
  estadopagoplan: boolean;
};

export type PagoPlanRaw = PagoPlan & PlanPrincipalRaw;
