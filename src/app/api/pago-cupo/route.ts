import { db } from "../utils/db";
import apiResponse from "../utils/apiResponse";
import apiResponseError from "../utils/apiResponseError";
import { NextRequest } from "next/server";
import { insertarPagoCupoSchema } from "../schemas/pago-cupo";
import { authGuard } from "../lib/auth/authGuard";
import { mapPagoCupo } from "../lib/mappers/pago-cupo";

export const dynamic = "force-dynamic";

// Registrar pago cupo
export async function POST(req: NextRequest) {
  try {
    await authGuard(req);

    const body = await req.json();
    const data = insertarPagoCupoSchema.parse(body);

    await db.query("CALL pa_insertar_pago_cupo($1, $2, $3)", [
      data.idCupo,
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

// Obtener pagos de cupos
export async function GET(req: NextRequest) {
  try {
    await authGuard(req);

    const result = await db.query(`
      SELECT
        pgc.idpagocupo,
        pgc.fechafacturacion,
        pgc.fechapago,
        pgc.mesespagados,
        pgc.monto,
        pgc.metodopago,
        pgc.nota,
        pgc.estado AS estadopagocupo,

        cv.idcupo,
        cv.usuario,
        cv.fechainicio,
        cv.proxpago,
        cv.nota,
        cv.estado AS estadocupov,

        p.idpersona,
        p.nombres,
        p.apellidos,
        p.telefono,
        p.sexo,
        p.tipoap,
        p.tipoc,
        p.tiposa,
        p.estado AS estadopersona,

        pp.idplanp,
        pp.nombreplan,
        pp.correo,
        pp.costo,
        pp.direccionplan,
        pp.estado AS estadoplanp,

        pc.idplancupo,
        pc.tipoplan,
        pc.duracionmes,
        pc.promo,
        pc.precio,
        pc.estado AS estadoplancupo,

        mp.idmetpago,
        mp.nombre,
        mp.estado AS estadometpago

      FROM pagocupo pgc
      JOIN cupovendido cv ON pgc.idcupo = cv.idcupo
      JOIN persona p ON cv.idpersona = p.idpersona
      JOIN planprincipal pp ON cv.idplanp = pp.idplanp
      JOIN plancupo pc ON cv.idplancupo = pc.idplancupo
      JOIN metodopago mp ON cv.idmetpago = mp.idmetpago
      `);

    const pagosCupos = result.rows.map(mapPagoCupo);

    return apiResponse(
      { data: pagosCupos, error: null, msg: "ok!" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}
