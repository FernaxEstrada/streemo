import { eq, sql } from "drizzle-orm";
import { db } from "../client";
import { MetodoPago, Tarjeta } from "../schema/payments";
import { Persona } from "../schema/auth";

// Crear método de pago (usa SP payments.pa_crear_metodo_pago)
export async function createMetodoPago(mtpnombre: string) {
  await db.execute(sql`
    CALL payments.pa_crear_metodo_pago(
      ${mtpnombre}
    )
  `);

  const rows = await db
    .select()
    .from(MetodoPago)
    .where(eq(MetodoPago.mtpnombre, mtpnombre))
    .limit(1);

  return rows[0] ?? null;
}

// Obtener todos los métodos de pago
export async function getAllMetodosPago() {
  const rows = await db.select().from(MetodoPago);
  return rows;
}

// Actualizar método de pago (usa SP payments.pa_actualizar_metodo_pago)
export async function updateMetodoPago(mtpid: string, mtpnombre: string) {
  await db.execute(sql`
    CALL payments.pa_actualizar_metodo_pago(
      ${mtpid},
      ${mtpnombre}
    )
  `);

  const rows = await db
    .select()
    .from(MetodoPago)
    .where(eq(MetodoPago.mtpid, mtpid))
    .limit(1);

  return rows[0] ?? null;
}

// Cambiar estado de método de pago (usa SP payments.pa_cambiar_estado_metodo_pago)
export async function updateMetodoPagoEstado(
  mtpid: string,
  mtpestado: boolean
) {
  await db.execute(sql`
    CALL payments.pa_cambiar_estado_metodo_pago(
      ${mtpid},
      ${mtpestado}
    )
  `);

  const rows = await db
    .select()
    .from(MetodoPago)
    .where(eq(MetodoPago.mtpid, mtpid))
    .limit(1);

  return rows[0] ?? null;
}

// Registrar tarjeta (usa SP payments.pa_registrar_tarjeta)
export async function createTarjeta(
  taridpersona: string,
  tarnumero: string,
  tarbanco: string,
  tarvencimiento: string
) {
  await db.execute(sql`
    CALL payments.pa_registrar_tarjeta(
      ${taridpersona},
      ${tarnumero},
      ${tarbanco},
      ${tarvencimiento}
    )
  `);

  const rows = await db
    .select()
    .from(Tarjeta)
    .where(eq(Tarjeta.tarnumero, tarnumero))
    .limit(1);

  return rows[0] ?? null;
}

// Obtener todas las tarjetas con datos de persona
export async function getAllTarjetasWithPersona() {
  const rows = await db
    .select({
      tarjeta: Tarjeta,
      persona: Persona,
    })
    .from(Tarjeta)
    .innerJoin(Persona, eq(Tarjeta.taridpersona, Persona.perid));

  return rows;
}

// Cambiar estado de tarjeta (usa SP payments.pa_cambiar_estado_tarjeta)
export async function updateTarjetaEstado(tarid: string, tarestado: boolean) {
  await db.execute(sql`
    CALL payments.pa_cambiar_estado_tarjeta(
      ${tarid},
      ${tarestado}
    )
  `);

  const rows = await db
    .select()
    .from(Tarjeta)
    .where(eq(Tarjeta.tarid, tarid))
    .limit(1);

  return rows[0] ?? null;
}
