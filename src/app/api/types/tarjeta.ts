import { Persona } from "./persona";

export type Tarjeta = {
  idtarjeta: string;
  numero: string;
  banco: string;
  vencimiento: string;
  estadotarjeta: boolean;
};

export type TarjetaRaw = Tarjeta & Persona;
