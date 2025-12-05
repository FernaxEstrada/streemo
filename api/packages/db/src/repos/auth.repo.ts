import { eq, sql } from "drizzle-orm";
import { db } from "../client";
import { Persona, Usuario } from "../schema/auth";

// Obtener usuario por nombre de usuario con datos de persona (para login)
export async function getUsuarioByUsername(usuusuario: string) {
  const rows = await db
    .select({
      usuario: Usuario,
      persona: Persona,
    })
    .from(Usuario)
    .innerJoin(Persona, eq(Usuario.perid, Persona.perid))
    .where(eq(Usuario.usuusuario, usuusuario))
    .limit(1);

  return rows[0] ?? null;
}

// Crear persona (usa SP auth.pa_registrar_persona)
export async function createPersona(
  pernombres: string,
  perapellidos: string,
  pertelefono: string,
  persexo: string,
  pertipoap: boolean,
  pertipoc: boolean,
  pertiposa: boolean
) {
  await db.execute(sql`
    CALL auth.pa_registrar_persona(
      ${pernombres},
      ${perapellidos},
      ${pertelefono},
      ${persexo},
      ${pertipoap},
      ${pertipoc},
      ${pertiposa}
    )
  `);

  const rows = await db
    .select()
    .from(Persona)
    .where(eq(Persona.pertelefono, pertelefono))
    .limit(1);

  return rows[0] ?? null;
}

// Obtener todas las personas
export async function getAllPersonas() {
  const rows = await db.select().from(Persona);
  return rows;
}

// Actualizar datos de persona (usa SP auth.pa_actualizar_datos_persona)
export async function updatePersonaDatos(
  perid: string,
  pernombres: string,
  perapellidos: string,
  pertelefono: string,
  persexo: string
) {
  await db.execute(sql`
    CALL auth.pa_actualizar_datos_persona(
      ${perid},
      ${pernombres},
      ${perapellidos},
      ${pertelefono},
      ${persexo}
    )
  `);

  const rows = await db
    .select()
    .from(Persona)
    .where(eq(Persona.perid, perid))
    .limit(1);

  return rows[0] ?? null;
}

// Cambiar estado de persona (usa SP auth.pa_cambiar_estado_persona)
export async function updatePersonaEstado(perid: string, perestado: boolean) {
  await db.execute(sql`
    CALL auth.pa_cambiar_estado_persona(
      ${perid},
      ${perestado}
    )
  `);

  const rows = await db
    .select()
    .from(Persona)
    .where(eq(Persona.perid, perid))
    .limit(1);

  return rows[0] ?? null;
}

// Actualizar roles de persona (usa SP auth.pa_actualizar_roles_persona)
export async function updatePersonaRoles(
  perid: string,
  pertipoap: boolean,
  pertipoc: boolean,
  pertiposa: boolean
) {
  await db.execute(sql`
    CALL auth.pa_actualizar_roles_persona(
      ${perid},
      ${pertipoap},
      ${pertipoc},
      ${pertiposa}
    )
  `);

  const rows = await db
    .select()
    .from(Persona)
    .where(eq(Persona.perid, perid))
    .limit(1);

  return rows[0] ?? null;
}

// Crear usuario (usa SP auth.pa_crear_usuario)
export async function createUsuario(
  perid: string,
  usuusuario: string,
  usucontrasena: string
) {
  await db.execute(sql`
    CALL auth.pa_crear_usuario(
      ${perid},
      ${usuusuario},
      ${usucontrasena}
    )
  `);

  const rows = await db
    .select()
    .from(Usuario)
    .where(eq(Usuario.perid, perid))
    .limit(1);

  return rows[0] ?? null;
}

// Obtener todos los usuarios con datos de persona
export async function getAllUsuariosWithPersona() {
  const rows = await db
    .select({
      usuario: Usuario,
      persona: Persona,
    })
    .from(Usuario)
    .innerJoin(Persona, eq(Usuario.perid, Persona.perid));

  return rows;
}

// Actualizar contraseña de usuario (usa SP auth.pa_actualizar_contrasena)
export async function updateUsuarioContrasena(
  perid: string,
  usucontrasena: string
) {
  await db.execute(sql`
    CALL auth.pa_actualizar_contrasena(
      ${perid},
      ${usucontrasena}
    )
  `);

  const rows = await db
    .select()
    .from(Usuario)
    .where(eq(Usuario.perid, perid))
    .limit(1);

  return rows[0] ?? null;
}

// Cambiar estado de usuario (usa SP auth.pa_cambiar_estado_usuario)
export async function updateUsuarioEstado(perid: string, usuactivo: boolean) {
  await db.execute(sql`
    CALL auth.pa_cambiar_estado_usuario(
      ${perid},
      ${usuactivo}
    )
  `);

  const rows = await db
    .select()
    .from(Usuario)
    .where(eq(Usuario.perid, perid))
    .limit(1);

  return rows[0] ?? null;
}

// Actualizar nombre de usuario (usa SP auth.pa_actualizar_usuario)
export async function updateUsuarioNombre(perid: string, usuusuario: string) {
  await db.execute(sql`
    CALL auth.pa_actualizar_usuario(
      ${perid},
      ${usuusuario}
    )
  `);

  const rows = await db
    .select()
    .from(Usuario)
    .where(eq(Usuario.perid, perid))
    .limit(1);

  return rows[0] ?? null;
}
