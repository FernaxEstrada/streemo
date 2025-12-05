import { pgSchema, uuid, varchar, boolean } from "drizzle-orm/pg-core";
import { Persona } from "./auth";

export const paymentsSchema = pgSchema("payments");

// Tabla: Metodo de Pago
// Métodos de pago disponibles en el sistema
export const MetodoPago = paymentsSchema.table("metodopago", {
  mtpid: uuid("mtpid").primaryKey().defaultRandom(),
  mtpnombre: varchar("mtpnombre", { length: 100 }).notNull(),
  mtpestado: boolean("mtpestado").notNull().default(true),
});

// Tabla: Tarjeta
// Tarjetas de débito asociadas a personas
export const Tarjeta = paymentsSchema.table("tarjeta", {
  tarid: uuid("tarid").primaryKey().defaultRandom(),
  taridpersona: uuid("taridpersona")
    .notNull()
    .references(() => Persona.perid),
  tarnumero: varchar("tarnumero", { length: 19 }).notNull(),
  tarbanco: varchar("tarbanco", { length: 50 }).notNull(),
  tarvencimiento: varchar("tarvencimiento", { length: 5 }).notNull(),
  tarestado: boolean("tarestado").notNull().default(true),
});
