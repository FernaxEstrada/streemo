import {
  pgSchema,
  uuid,
  varchar,
  boolean,
  date,
  numeric,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { PlanPrincipal } from "./plans";
import { CupoVendido } from "./quotas";

export const billingSchema = pgSchema("billing");

// Tabla: Pago Plan Principal
// Pagos realizados para planes principales
export const PagoPlanP = billingSchema.table("pagoplanp", {
  pgpid: uuid("pgpid").primaryKey().defaultRandom(),
  pgpfechafacturacion: date("pgpfechafacturacion").notNull(),
  pgpfechapago: timestamp("pgpfechapago").notNull(),
  pgpmonto: numeric("pgpmonto", { precision: 10, scale: 2 }).notNull(),
  pgpmetodopago: varchar("pgpmetodopago", { length: 50 }).notNull(),
  pgptarjeta: varchar("pgptarjeta", { length: 50 }).notNull(),
  pgpnota: varchar("pgpnota", { length: 200 }),
  pgpestado: boolean("pgpestado").notNull().default(true),
  pgpidplanp: uuid("pgpidplanp")
    .notNull()
    .references(() => PlanPrincipal.priid),
});

// Tabla: Pago Cupo
// Pagos realizados para cupos vendidos
export const PagoCupo = billingSchema.table("pagocupo", {
  pgcid: uuid("pgcid").primaryKey().defaultRandom(),
  pgcfechafacturacion: date("pgcfechafacturacion").notNull(),
  pgcfechapago: timestamp("pgcfechapago").notNull(),
  pgcmesespagados: integer("pgcmesespagados").notNull(),
  pgcmonto: numeric("pgcmonto", { precision: 10, scale: 2 }).notNull(),
  pgcmetodopago: varchar("pgcmetodopago", { length: 100 }).notNull(),
  pgcnota: varchar("pgcnota", { length: 200 }),
  pgcestado: boolean("pgcestado").notNull().default(true),
  pgcidcupovendido: uuid("pgcidcupovendido")
    .notNull()
    .references(() => CupoVendido.cveid),
});
