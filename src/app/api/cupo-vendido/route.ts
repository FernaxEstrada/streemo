import { db } from "../utils/db";
import apiResponse from "../utils/apiResponse";
import apiResponseError from "../utils/apiResponseError";
import { NextRequest } from "next/server";
import { insertarCupoVendidoSchema } from "../schemas/cupo-vendido";
import { authGuard } from "../lib/auth/authGuard";
import { mapCupoVendido } from "../lib/mappers/cupo-vendido";

export const dynamic = "force-dynamic";

// Insertar cupo vendido
export async function POST(req: NextRequest) {
  try {
    await authGuard(req);

    const body = await req.json();
    const data = insertarCupoVendidoSchema.parse(body);

    await db.query(
      "CALL pa_insertar_cupo_vendido($1, $2, $3, $4, $5, $6, $7)",
      [
        data.idPersona,
        data.idPlanP,
        data.idPlanCupo,
        data.idMetPago,
        data.usuario,
        data.fechaInicio,
        data.nota || null,
      ]
    );

    return apiResponse(
      {
        data: null,
        error: null,
        msg: "Cupo vendido registrado correctamente",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}

// Obtener cupos vendidos
export async function GET(req: NextRequest) {
  try {
    await authGuard(req);

    const result = await db.query(`
      SELECT
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

      FROM cupovendido cv
      JOIN persona p ON cv.idpersona = p.idpersona
      JOIN planprincipal pp ON cv.idplanp = pp.idplanp
      JOIN plancupo pc ON cv.idplancupo = pc.idplancupo
      JOIN metodopago mp ON cv.idmetpago = mp.idmetpago
      WHERE cv.estado = true
      `);

    const cuposVendidos = result.rows.map(mapCupoVendido);

    return apiResponse(
      { data: cuposVendidos, error: null, msg: "ok!" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}
