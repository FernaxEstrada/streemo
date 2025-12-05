import { pgSchema, uuid, varchar, boolean, char } from "drizzle-orm/pg-core";

export const authSchema = pgSchema("auth");

// Tabla: Persona
// Gestión de identidad y datos personales
export const Persona = authSchema.table("persona", {
  perid: uuid("perid").primaryKey().defaultRandom(),
  pernombres: varchar("pernombres", { length: 100 }).notNull(),
  perapellidos: varchar("perapellidos", { length: 100 }).notNull(),
  pertelefono: varchar("pertelefono", { length: 15 }).notNull(),
  persexo: char("persexo", { length: 1 }).notNull(),
  pertipoap: boolean("pertipoap").notNull(),
  pertipoc: boolean("pertipoc").notNull(),
  pertiposa: boolean("pertiposa").notNull(),
  perestado: boolean("perestado").notNull().default(true),
});

// Tabla: Usuario
// Credenciales y acceso al sistema
export const Usuario = authSchema.table("usuario", {
  perid: uuid("perid")
    .primaryKey()
    .references(() => Persona.perid),
  usuusuario: varchar("usuusuario", { length: 100 }).notNull().unique(),
  usucontrasena: varchar("usucontrasena", { length: 60 }).notNull(),
  usuactivo: boolean("usuactivo").notNull().default(true),
});
