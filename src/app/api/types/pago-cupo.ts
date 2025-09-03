import { CupoVendidoRaw } from "./cupo-vendido";

export type PagoCupo = {
  idpagocupo: string;
  fechafacturacion: string;
  fechapago: string;
  mesespagados: number;
  monto: number;
  metodopago: string;
  nota: string | null;
  estadopagocupo: boolean;
};

export type PagoCupoRaw = PagoCupo & CupoVendidoRaw;
