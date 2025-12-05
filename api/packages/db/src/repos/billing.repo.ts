import { eq, sql } from "drizzle-orm";
import { db } from "../client";
import { PagoPlanP, PagoCupo } from "../schema/billing";
import { PlanPrincipal } from "../schema/plans";
import { CupoVendido } from "../schema/quotas";

// Insertar pago de plan principal (usa SP billing.pa_insertar_pago_planp)
export async function createPagoPlanP(
  pgpidplanp: string,
  pgpfechapago: string,
  pgpnota?: string
) {
  await db.execute(sql`
    CALL billing.pa_insertar_pago_planp(
      ${pgpidplanp},
      ${pgpfechapago},
      ${pgpnota || null}
    )
  `);

  const rows = await db
    .select()
    .from(PagoPlanP)
    .where(eq(PagoPlanP.pgpidplanp, pgpidplanp))
    .orderBy((t) => t.pgpfechapago)
    .limit(1);

  return rows[0] ?? null;
}

// Obtener todos los pagos de planes principales con datos relacionados
export async function getAllPagosPlanPWithRelations() {
  const rows = await db
    .select({
      pagoplanp: PagoPlanP,
      planprincipal: PlanPrincipal,
    })
    .from(PagoPlanP)
    .innerJoin(PlanPrincipal, eq(PagoPlanP.pgpidplanp, PlanPrincipal.priid));

  return rows;
}

// Actualizar nota del pago de plan principal (usa SP billing.pa_actualizar_nota_pago_planp)
export async function updatePagoPlanPNota(pgpid: string, pgpnota: string) {
  await db.execute(sql`
    CALL billing.pa_actualizar_nota_pago_planp(
      ${pgpid},
      ${pgpnota}
    )
  `);

  const rows = await db
    .select()
    .from(PagoPlanP)
    .where(eq(PagoPlanP.pgpid, pgpid))
    .limit(1);

  return rows[0] ?? null;
}

// Cambiar estado del pago de plan principal (usa SP billing.pa_cambiar_estado_pago_planp)
export async function updatePagoPlanPEstado(pgpid: string, pgpestado: boolean) {
  await db.execute(sql`
    CALL billing.pa_cambiar_estado_pago_planp(
      ${pgpid},
      ${pgpestado}
    )
  `);

  const rows = await db
    .select()
    .from(PagoPlanP)
    .where(eq(PagoPlanP.pgpid, pgpid))
    .limit(1);

  return rows[0] ?? null;
}

// Insertar pago de cupo (usa SP billing.pa_insertar_pago_cupo)
export async function createPagoCupo(
  pgcidcupovendido: string,
  pgcfechapago: string,
  pgcnota?: string
) {
  await db.execute(sql`
    CALL billing.pa_insertar_pago_cupo(
      ${pgcidcupovendido},
      ${pgcfechapago},
      ${pgcnota || null}
    )
  `);

  const rows = await db
    .select()
    .from(PagoCupo)
    .where(eq(PagoCupo.pgcidcupovendido, pgcidcupovendido))
    .orderBy((t) => t.pgcfechapago)
    .limit(1);

  return rows[0] ?? null;
}

// Obtener todos los pagos de cupos con datos relacionados
export async function getAllPagosCupoWithRelations() {
  const rows = await db
    .select({
      pagocupo: PagoCupo,
      cupovendido: CupoVendido,
    })
    .from(PagoCupo)
    .innerJoin(CupoVendido, eq(PagoCupo.pgcidcupovendido, CupoVendido.cveid));

  return rows;
}

// Actualizar nota del pago de cupo (usa SP billing.pa_actualizar_nota_pago_cupo)
export async function updatePagoCupoNota(pgcid: string, pgcnota: string) {
  await db.execute(sql`
    CALL billing.pa_actualizar_nota_pago_cupo(
      ${pgcid},
      ${pgcnota}
    )
  `);

  const rows = await db
    .select()
    .from(PagoCupo)
    .where(eq(PagoCupo.pgcid, pgcid))
    .limit(1);

  return rows[0] ?? null;
}

// Cambiar estado del pago de cupo (usa SP billing.pa_cambiar_estado_pago_cupo)
export async function updatePagoCupoEstado(pgcid: string, pgcestado: boolean) {
  await db.execute(sql`
    CALL billing.pa_cambiar_estado_pago_cupo(
      ${pgcid},
      ${pgcestado}
    )
  `);

  const rows = await db
    .select()
    .from(PagoCupo)
    .where(eq(PagoCupo.pgcid, pgcid))
    .limit(1);

  return rows[0] ?? null;
}
