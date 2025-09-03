import { db } from "../utils/db";
import apiResponse from "../utils/apiResponse";
import apiResponseError from "../utils/apiResponseError";
import { NextRequest } from "next/server";
import { registrarPersonaSchema } from "../schemas/persona";
import { authGuard } from "../lib/auth/authGuard";

export const dynamic = "force-dynamic";

// Registrar persona
export async function POST(req: NextRequest) {
  try {
    await authGuard(req);

    const body = await req.json();
    const data = registrarPersonaSchema.parse(body);

    await db.query("CALL pa_registrar_persona($1, $2, $3, $4, $5, $6, $7)", [
      data.nombres,
      data.apellidos,
      data.telefono,
      data.sexo,
      data.tipoap,
      data.tipoc,
      data.tiposa,
    ]);

    return apiResponse(
      { data: null, error: null, msg: "Persona Registrada" },
      { status: 201 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}

// Obtener personas
export async function GET(req: NextRequest) {
  try {
    await authGuard(req);

    const result = await db.query(`
      SELECT 
        idpersona, 
        nombres, 
        apellidos, 
        telefono, 
        sexo, 
        tipoap, 
        tipoc, 
        tiposa, 
        estado 
      FROM persona 
      `);
    return apiResponse(
      { data: result.rows, error: null, msg: "ok!" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}
