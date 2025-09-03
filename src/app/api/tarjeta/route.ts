import { db } from "../utils/db";
import apiResponse from "../utils/apiResponse";
import apiResponseError from "../utils/apiResponseError";
import { NextRequest } from "next/server";
import { registrarTarjetaSchema } from "../schemas/tarjeta";
import { authGuard } from "../lib/auth/authGuard";
import { mapTarjeta } from "../lib/mappers/tarjeta";

export const dynamic = "force-dynamic";

// Registrar tarjeta
export async function POST(req: NextRequest) {
  try {
    await authGuard(req);

    const body = await req.json();
    const data = registrarTarjetaSchema.parse(body);

    await db.query("CALL pa_registrar_tarjeta($1, $2, $3, $4)", [
      data.idPersona,
      data.numero,
      data.banco,
      data.vencimiento,
    ]);

    return apiResponse(
      { data: null, error: null, msg: "Tarjeta registrada" },
      { status: 201 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}

// Obtener tarjetas
export async function GET(req: NextRequest) {
  try {
    await authGuard(req);

    const result = await db.query(`
      SELECT
        t.idtarjeta,
        CONCAT('**** **** **** ', RIGHT(t.numero, 4)) AS numero,
        t.banco,
        t.vencimiento,
        t.estado AS estadotarjeta,
        
        p.idpersona,
        p.nombres,
        p.apellidos,
        p.telefono,
        p.sexo,
        p.tipoap,
        p.tipoc,
        p.tiposa,
        p.estado AS estadopersona
      FROM tarjeta t
      JOIN persona p ON t.idpersona = p.idpersona
      `);

    const tarjetas = result.rows.map(mapTarjeta);

    return apiResponse(
      { data: tarjetas, error: null, msg: "ok!" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}
