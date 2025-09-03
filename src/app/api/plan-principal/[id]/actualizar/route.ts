import { NextRequest } from "next/server";
import { db } from "../../../utils/db";
import apiResponse from "../../../utils/apiResponse";
import apiResponseError from "../../../utils/apiResponseError";
import { actualizarDatosBasicosPlanSchema } from "@/app/api/schemas/plan-principal";
import { Params } from "@/app/api/types/params";
import { authGuard } from "@/app/api/lib/auth/authGuard";

export const dynamic = "force-dynamic";

// Actualizar datos basicos del plan principal
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await authGuard(req);

    const body = await req.json();
    const { id } = await params;
    const data = actualizarDatosBasicosPlanSchema.parse({
      ...body,
      idPlanP: id,
    });

    await db.query(
      "CALL pa_actualizar_datos_basicos_plan($1, $2, $3, $4, $5)",
      [
        data.idPlanP,
        data.nombrePlan,
        data.correo,
        data.costo,
        data.direccionPlan,
      ]
    );

    return apiResponse(
      { data: null, error: null, msg: "Datos del plan actualizados" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}
