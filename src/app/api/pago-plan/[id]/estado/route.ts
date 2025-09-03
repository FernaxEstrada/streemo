import { NextRequest } from "next/server";
import { db } from "../../../utils/db";
import apiResponse from "@/app/api/utils/apiResponse";
import apiResponseError from "@/app/api/utils/apiResponseError";
import { cambiarEstadoPagoPlanSchema } from "@/app/api/schemas/pago-plan";
import { Params } from "@/app/api/types/params";
import { authGuard } from "@/app/api/lib/auth/authGuard";

export const dynamic = "force-dynamic";

// Cambiar estado pago plan
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await authGuard(req);

    const body = await req.json();
    const { id } = await params;
    const data = cambiarEstadoPagoPlanSchema.parse({
      ...body,
      idPagoPlan: id,
    });

    await db.query("CALL pa_cambiar_estado_pago_plan($1, $2)", [
      data.idPagoPlan,
      data.estado,
    ]);

    return apiResponse(
      { data: null, error: null, msg: "Estado del pago actualizado" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}
