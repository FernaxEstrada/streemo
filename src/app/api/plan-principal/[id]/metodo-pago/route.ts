import { NextRequest } from "next/server";
import { db } from "../../../utils/db";
import apiResponse from "../../../utils/apiResponse";
import apiResponseError from "../../../utils/apiResponseError";
import { cambiarMetodoPagoPlanSchema } from "@/app/api/schemas/plan-principal";
import { Params } from "@/app/api/types/params";
import { authGuard } from "@/app/api/lib/auth/authGuard";

export const dynamic = "force-dynamic";

// Cambiar metodo de pago del plan principal
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await authGuard(req);

    const body = await req.json();
    const { id } = await params;
    const data = cambiarMetodoPagoPlanSchema.parse({
      ...body,
      idPlanP: id,
    });

    await db.query("CALL pa_cambiar_metodo_pago_plan($1, $2)", [
      data.idPlanP,
      data.idMetPago,
    ]);

    return apiResponse(
      { data: null, error: null, msg: "Método de pago actualizado" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}
