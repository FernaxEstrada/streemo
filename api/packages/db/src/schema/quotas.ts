import { pgSchema, uuid, varchar, boolean, date } from "drizzle-orm/pg-core";
import { Persona } from "./auth";
import { MetodoPago } from "./payments";
import { PlanPrincipal, PlanCupo } from "./plans";

export const quotasSchema = pgSchema("quotas");

// Tabla: Cupo Vendido
// Cupos vendidos a personas
export const CupoVendido = quotasSchema.table("cupovendido", {
  cveid: uuid("cveid").primaryKey().defaultRandom(),
  cveusuario: varchar("cveusuario", { length: 100 }).notNull(),
  cvefechainicio: date("cvefechainicio").notNull(),
  cveproxpago: date("cveproxpago"),
  cvenota: varchar("cvenota", { length: 200 }),
  cveestado: boolean("cveestado").notNull().default(true),
  cveidpersona: uuid("cveidpersona")
    .notNull()
    .references(() => Persona.perid),
  cveidplanp: uuid("cveidplanp")
    .notNull()
    .references(() => PlanPrincipal.priid),
  cveidplancupo: uuid("cveidplancupo")
    .notNull()
    .references(() => PlanCupo.cupid),
  cveidmetpago: uuid("cveidmetpago")
    .notNull()
    .references(() => MetodoPago.mtpid),
});
