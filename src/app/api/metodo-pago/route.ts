import { db } from "../utils/db";
import apiResponse from "../utils/apiResponse";
import apiResponseError from "../utils/apiResponseError";
import { NextRequest } from "next/server";
import { crearMetodoPagoSchema } from "../schemas/metodo-pago";
import { authGuard } from "../lib/auth/authGuard";

export const dynamic = "force-dynamic";

// Crear metodo de pago
export async function POST(req: NextRequest) {
  try {
    await authGuard(req);

    const body = await req.json();
    const data = crearMetodoPagoSchema.parse(body);

    await db.query("CALL pa_crear_metodo_pago($1)", [data.nombre]);

    return apiResponse(
      { data: null, error: null, msg: "Método de pago creado" },
      { status: 201 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}

// Obtener metodos de pago
export async function GET(req: NextRequest) {
  try {
    await authGuard(req);

    const result = await db.query(`
      SELECT 
        idmetpago, 
        nombre, 
        estado 
      FROM metodopago
      `);
    return apiResponse(
      { data: result.rows, error: null, msg: "ok!" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}
