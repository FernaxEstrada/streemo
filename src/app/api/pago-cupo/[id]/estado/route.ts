import { NextRequest } from "next/server";
import { db } from "../../../utils/db";
import apiResponse from "@/app/api/utils/apiResponse";
import apiResponseError from "@/app/api/utils/apiResponseError";
import { cambiarEstadoPagoCupoSchema } from "@/app/api/schemas/pago-cupo";
import { Params } from "@/app/api/types/params";
import { authGuard } from "@/app/api/lib/auth/authGuard";

export const dynamic = "force-dynamic";

// Cambiar estado pago cupo
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await authGuard(req);

    const body = await req.json();
    const { id } = await params;
    const data = cambiarEstadoPagoCupoSchema.parse({
      ...body,
      idPagoCupo: id,
    });

    await db.query("CALL pa_actualizar_estado_pago_cupo($1, $2)", [
      data.idPagoCupo,
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
