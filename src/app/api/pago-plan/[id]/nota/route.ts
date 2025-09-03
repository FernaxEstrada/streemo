import { NextRequest } from "next/server";
import { db } from "../../../utils/db";
import apiResponse from "../../../utils/apiResponse";
import apiResponseError from "../../../utils/apiResponseError";
import { actualizarNotaPagoPlanSchema } from "@/app/api/schemas/pago-plan";
import { Params } from "@/app/api/types/params";
import { authGuard } from "@/app/api/lib/auth/authGuard";

export const dynamic = "force-dynamic";

// Actualizar nota de pago plan
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await authGuard(req);

    const body = await req.json();
    const { id } = await params;
    const data = actualizarNotaPagoPlanSchema.parse({
      ...body,
      idPagoPlan: id,
    });

    await db.query("CALL pa_actualizar_nota_pago_plan($1, $2)", [
      data.idPagoPlan,
      data.nota,
    ]);

    return apiResponse(
      {
        data: null,
        error: null,
        msg: "Nota del pago actualizada correctamente",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}
