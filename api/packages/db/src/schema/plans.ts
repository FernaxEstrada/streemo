import {
  pgSchema,
  uuid,
  varchar,
  boolean,
  date,
  numeric,
  integer,
} from "drizzle-orm/pg-core";
import { Persona } from "./auth";
import { MetodoPago, Tarjeta } from "./payments";

export const plansSchema = pgSchema("plans");

// Tabla: Plan Principal
// Planes principales de suscripción
export const PlanPrincipal = plansSchema.table("planprincipal", {
  priid: uuid("priid").primaryKey().defaultRandom(),
  prinombre: varchar("prinombre", { length: 100 }).notNull().unique(),
  pricorreo: varchar("pricorreo", { length: 100 }).notNull(),
  prifechainicio: date("prifechainicio").notNull(),
  pricosto: numeric("pricosto", { precision: 10, scale: 2 }).notNull(),
  priproxpago: date("priproxpago"),
  pridireccion: varchar("pridireccion", { length: 200 }).notNull(),
  priestado: boolean("priestado").notNull().default(true),
  priidpersona: uuid("priidpersona")
    .notNull()
    .references(() => Persona.perid),
  priidmetpago: uuid("priidmetpago")
    .notNull()
    .references(() => MetodoPago.mtpid),
  priidtarjeta: uuid("priidtarjeta")
    .notNull()
    .references(() => Tarjeta.tarid),
});

// Tabla: Plan Cupo
// Planes de cupos disponibles
export const PlanCupo = plansSchema.table("plancupo", {
  cupid: uuid("cupid").primaryKey().defaultRandom(),
  cupnombre: varchar("cupnombre", { length: 50 }).notNull(),
  cupduracionmeses: integer("cupduracionmeses").notNull(),
  cuppromocion: boolean("cuppromocion").notNull(),
  cupprecio: numeric("cupprecio", { precision: 10, scale: 2 }).notNull(),
  cupestado: boolean("cupestado").notNull().default(true),
});
