import { eq, sql } from "drizzle-orm";
import { db } from "../client";
import { PlanPrincipal, PlanCupo } from "../schema/plans";
import { Persona } from "../schema/auth";
import { MetodoPago, Tarjeta } from "../schema/payments";

// Registrar plan principal (usa SP plans.pa_registrar_plan_principal)
export async function createPlanPrincipal(
  priidpersona: string,
  prinombre: string,
  pricorreo: string,
  prifechainicio: string,
  pricosto: number,
  pridireccion: string,
  priidmetpago: string,
  priidtarjeta: string
) {
  await db.execute(sql`
    CALL plans.pa_registrar_plan_principal(
      ${priidpersona},
      ${prinombre},
      ${pricorreo},
      ${prifechainicio},
      ${pricosto},
      ${pridireccion},
      ${priidmetpago},
      ${priidtarjeta}
    )
  `);

  const rows = await db
    .select()
    .from(PlanPrincipal)
    .where(eq(PlanPrincipal.prinombre, prinombre))
    .limit(1);

  return rows[0] ?? null;
}

// Obtener todos los planes principales con datos relacionados
export async function getAllPlanesPrincipalesWithRelations() {
  const rows = await db
    .select({
      planprincipal: PlanPrincipal,
      persona: Persona,
      metodopago: MetodoPago,
      tarjeta: Tarjeta,
    })
    .from(PlanPrincipal)
    .innerJoin(Persona, eq(PlanPrincipal.priidpersona, Persona.perid))
    .innerJoin(MetodoPago, eq(PlanPrincipal.priidmetpago, MetodoPago.mtpid))
    .innerJoin(Tarjeta, eq(PlanPrincipal.priidtarjeta, Tarjeta.tarid))
    .where(eq(PlanPrincipal.priestado, true));

  return rows;
}

// Actualizar datos básicos del plan (usa SP plans.pa_actualizar_datos_basicos_plan)
export async function updatePlanPrincipalDatos(
  priid: string,
  prinombre: string,
  pricorreo: string,
  pricosto: number,
  pridireccion: string
) {
  await db.execute(sql`
    CALL plans.pa_actualizar_datos_basicos_plan(
      ${priid},
      ${prinombre},
      ${pricorreo},
      ${pricosto},
      ${pridireccion}
    )
  `);

  const rows = await db
    .select()
    .from(PlanPrincipal)
    .where(eq(PlanPrincipal.priid, priid))
    .limit(1);

  return rows[0] ?? null;
}

// Cambiar método de pago del plan (usa SP plans.pa_cambiar_metodo_pago_plan)
export async function updatePlanPrincipalMetodoPago(
  priid: string,
  priidmetpago: string
) {
  await db.execute(sql`
    CALL plans.pa_cambiar_metodo_pago_plan(
      ${priid},
      ${priidmetpago}
    )
  `);

  const rows = await db
    .select()
    .from(PlanPrincipal)
    .where(eq(PlanPrincipal.priid, priid))
    .limit(1);

  return rows[0] ?? null;
}

// Cambiar tarjeta del plan (usa SP plans.pa_cambiar_tarjeta_plan)
export async function updatePlanPrincipalTarjeta(
  priid: string,
  priidtarjeta: string
) {
  await db.execute(sql`
    CALL plans.pa_cambiar_tarjeta_plan(
      ${priid},
      ${priidtarjeta}
    )
  `);

  const rows = await db
    .select()
    .from(PlanPrincipal)
    .where(eq(PlanPrincipal.priid, priid))
    .limit(1);

  return rows[0] ?? null;
}

// Cambiar estado del plan principal (usa SP plans.pa_cambiar_estado_plan_principal)
export async function updatePlanPrincipalEstado(
  priid: string,
  priestado: boolean
) {
  await db.execute(sql`
    CALL plans.pa_cambiar_estado_plan_principal(
      ${priid},
      ${priestado}
    )
  `);

  const rows = await db
    .select()
    .from(PlanPrincipal)
    .where(eq(PlanPrincipal.priid, priid))
    .limit(1);

  return rows[0] ?? null;
}

// Insertar plan cupo (usa SP plans.pa_insertar_plan_cupo)
export async function createPlanCupo(
  cupnombre: string,
  cupduracionmeses: number,
  cuppromocion: boolean,
  cupprecio: number
) {
  await db.execute(sql`
    CALL plans.pa_insertar_plan_cupo(
      ${cupnombre},
      ${cupduracionmeses},
      ${cuppromocion},
      ${cupprecio}
    )
  `);

  const rows = await db
    .select()
    .from(PlanCupo)
    .where(eq(PlanCupo.cupnombre, cupnombre))
    .limit(1);

  return rows[0] ?? null;
}

// Obtener todos los planes cupo
export async function getAllPlanesCupo() {
  const rows = await db.select().from(PlanCupo);
  return rows;
}

// Actualizar plan cupo (usa SP plans.pa_actualizar_plan_cupo)
export async function updatePlanCupo(
  cupid: string,
  cupnombre: string,
  cupduracionmeses: number,
  cuppromocion: boolean,
  cupprecio: number
) {
  await db.execute(sql`
    CALL plans.pa_actualizar_plan_cupo(
      ${cupid},
      ${cupnombre},
      ${cupduracionmeses},
      ${cuppromocion},
      ${cupprecio}
    )
  `);

  const rows = await db
    .select()
    .from(PlanCupo)
    .where(eq(PlanCupo.cupid, cupid))
    .limit(1);

  return rows[0] ?? null;
}

// Cambiar estado del plan cupo (usa SP plans.pa_cambiar_estado_plan_cupo)
export async function updatePlanCupoEstado(cupid: string, cupestado: boolean) {
  await db.execute(sql`
    CALL plans.pa_cambiar_estado_plan_cupo(
      ${cupid},
      ${cupestado}
    )
  `);

  const rows = await db
    .select()
    .from(PlanCupo)
    .where(eq(PlanCupo.cupid, cupid))
    .limit(1);

  return rows[0] ?? null;
}
