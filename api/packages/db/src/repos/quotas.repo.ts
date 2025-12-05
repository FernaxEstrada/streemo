import { eq, sql } from "drizzle-orm";
import { db } from "../client";
import { CupoVendido } from "../schema/quotas";
import { Persona } from "../schema/auth";
import { PlanPrincipal, PlanCupo } from "../schema/plans";
import { MetodoPago } from "../schema/payments";

// Insertar cupo vendido (usa SP quotas.pa_insertar_cupo_vendido)
export async function createCupoVendido(
  cveidpersona: string,
  cveidplanp: string,
  cveidplancupo: string,
  cveidmetpago: string,
  cveusuario: string,
  cvefechainicio: string,
  cvenota?: string
) {
  await db.execute(sql`
    CALL quotas.pa_insertar_cupo_vendido(
      ${cveidpersona},
      ${cveidplanp},
      ${cveidplancupo},
      ${cveidmetpago},
      ${cveusuario},
      ${cvefechainicio},
      ${cvenota || null}
    )
  `);

  const rows = await db
    .select()
    .from(CupoVendido)
    .where(eq(CupoVendido.cveusuario, cveusuario))
    .limit(1);

  return rows[0] ?? null;
}

// Obtener todos los cupos vendidos con datos relacionados
export async function getAllCuposVendidosWithRelations() {
  const rows = await db
    .select({
      cupovendido: CupoVendido,
      persona: Persona,
      planprincipal: PlanPrincipal,
      plancupo: PlanCupo,
      metodopago: MetodoPago,
    })
    .from(CupoVendido)
    .innerJoin(Persona, eq(CupoVendido.cveidpersona, Persona.perid))
    .innerJoin(PlanPrincipal, eq(CupoVendido.cveidplanp, PlanPrincipal.priid))
    .innerJoin(PlanCupo, eq(CupoVendido.cveidplancupo, PlanCupo.cupid))
    .innerJoin(MetodoPago, eq(CupoVendido.cveidmetpago, MetodoPago.mtpid))
    .where(eq(CupoVendido.cveestado, true));

  return rows;
}

// Actualizar datos del cupo vendido (usa SP quotas.pa_actualizar_datos_cupo_vendido)
export async function updateCupoVendidoDatos(
  cveid: string,
  cveusuario: string,
  cvenota?: string
) {
  await db.execute(sql`
    CALL quotas.pa_actualizar_datos_cupo_vendido(
      ${cveid},
      ${cveusuario},
      ${cvenota || null}
    )
  `);

  const rows = await db
    .select()
    .from(CupoVendido)
    .where(eq(CupoVendido.cveid, cveid))
    .limit(1);

  return rows[0] ?? null;
}

// Cambiar plan del cupo vendido (usa SP quotas.pa_cambiar_plan_cupo_vendido)
export async function updateCupoVendidoPlan(
  cveid: string,
  cveidplancupo: string
) {
  await db.execute(sql`
    CALL quotas.pa_cambiar_plan_cupo_vendido(
      ${cveid},
      ${cveidplancupo}
    )
  `);

  const rows = await db
    .select()
    .from(CupoVendido)
    .where(eq(CupoVendido.cveid, cveid))
    .limit(1);

  return rows[0] ?? null;
}

// Cambiar estado del cupo vendido (usa SP quotas.pa_cambiar_estado_cupo_vendido)
export async function updateCupoVendidoEstado(
  cveid: string,
  cveestado: boolean
) {
  await db.execute(sql`
    CALL quotas.pa_cambiar_estado_cupo_vendido(
      ${cveid},
      ${cveestado}
    )
  `);

  const rows = await db
    .select()
    .from(CupoVendido)
    .where(eq(CupoVendido.cveid, cveid))
    .limit(1);

  return rows[0] ?? null;
}

// Cambiar método de pago del cupo vendido (usa SP quotas.pa_cambiar_metodo_pago_cupo_vendido)
export async function updateCupoVendidoMetodoPago(
  cveid: string,
  cveidmetpago: string
) {
  await db.execute(sql`
    CALL quotas.pa_cambiar_metodo_pago_cupo_vendido(
      ${cveid},
      ${cveidmetpago}
    )
  `);

  const rows = await db
    .select()
    .from(CupoVendido)
    .where(eq(CupoVendido.cveid, cveid))
    .limit(1);

  return rows[0] ?? null;
}
