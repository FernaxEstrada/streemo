import { NextRequest } from "next/server";
import { db } from "../../../utils/db";
import apiResponse from "@/app/api/utils/apiResponse";
import apiResponseError from "@/app/api/utils/apiResponseError";
import { cambiarEstadoPlanCupoSchema } from "@/app/api/schemas/plan-cupo";
import { Params } from "@/app/api/types/params";
import { authGuard } from "@/app/api/lib/auth/authGuard";

export const dynamic = "force-dynamic";

// Cambiar estado plan cupo
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await authGuard(req);

    const body = await req.json();
    const { id } = await params;
    const data = cambiarEstadoPlanCupoSchema.parse({
      ...body,
      idPlanCupo: id,
    });

    await db.query("CALL pa_cambiar_estado_plan_cupo($1, $2)", [
      data.idPlanCupo,
      data.estado,
    ]);

    return apiResponse(
      { data: null, error: null, msg: "Estado del plan de cupo actualizado" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}
