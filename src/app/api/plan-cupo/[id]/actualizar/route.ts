import { NextRequest } from "next/server";
import { db } from "../../../utils/db";
import apiResponse from "../../../utils/apiResponse";
import apiResponseError from "../../../utils/apiResponseError";
import { actualizarPlanCupoSchema } from "@/app/api/schemas/plan-cupo";
import { Params } from "@/app/api/types/params";
import { authGuard } from "@/app/api/lib/auth/authGuard";

export const dynamic = "force-dynamic";

// Actualizar datos plan cupo
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await authGuard(req);

    const body = await req.json();
    const { id } = await params;
    const data = actualizarPlanCupoSchema.parse({
      ...body,
      idPlanCupo: id,
    });

    await db.query("CALL pa_actualizar_plan_cupo($1, $2, $3, $4, $5)", [
      data.idPlanCupo,
      data.tipoPlan,
      data.duracionMes,
      data.promo,
      data.precio,
    ]);

    return apiResponse(
      {
        data: null,
        error: null,
        msg: "Datos del plan de cupo actualizados correctamente",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}
