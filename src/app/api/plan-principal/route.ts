import { db } from "../utils/db";
import apiResponse from "../utils/apiResponse";
import apiResponseError from "../utils/apiResponseError";
import { NextRequest } from "next/server";
import { registrarPlanSchema } from "../schemas/plan-principal";
import { authGuard } from "../lib/auth/authGuard";
import { mapPlanPrincipal } from "../lib/mappers/plan-principal";

export const dynamic = "force-dynamic";

// Registrar plan principal
export async function POST(req: NextRequest) {
  try {
    await authGuard(req);

    const body = await req.json();
    const data = registrarPlanSchema.parse(body);

    await db.query(
      "CALL pa_registrar_plan_principal($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        data.idPersona,
        data.nombrePlan,
        data.correo,
        data.fechaInicio,
        data.costo,
        data.direccionPlan,
        data.idMetPago,
        data.idTarjeta,
      ]
    );

    return apiResponse(
      {
        data: null,
        error: null,
        msg: "Plan principal registrado correctamente",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}

// Obtener planes principales
export async function GET(req: NextRequest) {
  try {
    await authGuard(req);

    const result = await db.query(`
      SELECT
        pp.idplanp,
        pp.nombreplan,
        pp.correo,
        pp.fechainicio,
        pp.costo,
        pp.proxpago,
        pp.direccionplan,
        pp.estado AS estadoplanp,

        p.idpersona,
        p.nombres,
        p.apellidos,
        p.telefono,
        p.sexo,
        p.tipoap,
        p.tipoc,
        p.tiposa,
        p.estado AS estadopersona,

        mp.idmetpago,
        mp.nombre,
        mp.estado AS estadometpago,
        
        t.idtarjeta,
        CONCAT('**** **** **** ', RIGHT(t.numero, 4)) AS numero,
        t.banco,
        t.vencimiento,
        t.estado AS estadotarjeta
      FROM planprincipal pp
      JOIN persona p ON pp.idpersona = p.idpersona
      JOIN metodopago mp ON pp.idmetpago = mp.idmetpago
      JOIN tarjeta t ON pp.idtarjeta = t.idtarjeta
      WHERE pp.estado = true
      `);

    const planesPrincipales = result.rows.map(mapPlanPrincipal);

    return apiResponse(
      { data: planesPrincipales, error: null, msg: "ok!" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}
