import { db } from "../utils/db";
import apiResponse from "../utils/apiResponse";
import apiResponseError from "../utils/apiResponseError";
import { NextRequest } from "next/server";
import { insertarPlanCupoSchema } from "../schemas/plan-cupo";
import { authGuard } from "../lib/auth/authGuard";

export const dynamic = "force-dynamic";

// Registrar plan cupo
export async function POST(req: NextRequest) {
  try {
    await authGuard(req);

    const body = await req.json();
    const data = insertarPlanCupoSchema.parse(body);

    await db.query("CALL pa_insertar_plan_cupo($1, $2, $3, $4)", [
      data.tipoPlan,
      data.duracionMes,
      data.promo,
      data.precio,
    ]);

    return apiResponse(
      {
        data: null,
        error: null,
        msg: "Plan de cupo registrado correctamente",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}

// Obtener planes de cupos
export async function GET(req: NextRequest) {
  try {
    await authGuard(req);

    const result = await db.query(`
      SELECT
        idplancupo,
        tipoplan,
        duracionmes,
        promo,
        precio,
        estado
      FROM plancupo
      `);
    return apiResponse(
      { data: result.rows, error: null, msg: "ok!" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}
