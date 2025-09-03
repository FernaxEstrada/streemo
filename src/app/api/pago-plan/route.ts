import { db } from "../utils/db";
import apiResponse from "../utils/apiResponse";
import apiResponseError from "../utils/apiResponseError";
import { NextRequest } from "next/server";
import { insertarPagoPlanSchema } from "../schemas/pago-plan";
import { authGuard } from "../lib/auth/authGuard";
import { mapPagoPlan } from "../lib/mappers/pago-plan";

export const dynamic = "force-dynamic";

// Registrar pago plan
export async function POST(req: NextRequest) {
  try {
    await authGuard(req);

    const body = await req.json();
    const data = insertarPagoPlanSchema.parse(body);

    await db.query("CALL pa_insertar_pago_plan($1, $2, $3)", [
      data.idPlanP,
      data.fechaPago,
      data.nota || null,
    ]);

    return apiResponse(
      {
        data: null,
        error: null,
        msg: "Pago registrado correctamente",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}

// Obtener pagos de planes
export async function GET(req: NextRequest) {
  try {
    await authGuard(req);

    const result = await db.query(`
      SELECT
        ppl.idpagoplan,
        ppl.fechafacturacion,
        ppl.fechapago,
        ppl.monto,
        ppl.metodopago,
        ppl.tarjeta,
        ppl.nota,
        ppl.estado AS estadopagoplan,

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
      FROM pagoplan ppl
      JOIN planprincipal pp ON ppl.idplanp = pp.idplanp
      JOIN persona p ON pp.idpersona = p.idpersona
      JOIN metodopago mp ON pp.idmetpago = mp.idmetpago
      JOIN tarjeta t ON pp.idtarjeta = t.idtarjeta
      `);

    const pagosPlanes = result.rows.map(mapPagoPlan);

    return apiResponse(
      { data: pagosPlanes, error: null, msg: "ok!" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}
