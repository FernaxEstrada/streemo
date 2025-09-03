import { NextRequest } from "next/server";
import { db } from "../../../utils/db";
import apiResponse from "@/app/api/utils/apiResponse";
import apiResponseError from "@/app/api/utils/apiResponseError";
import { cambiarEstadoTarjetaSchema } from "@/app/api/schemas/tarjeta";
import { Params } from "@/app/api/types/params";
import { authGuard } from "@/app/api/lib/auth/authGuard";

export const dynamic = "force-dynamic";

// Cambiar estado tarjeta
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await authGuard(req);

    const body = await req.json();
    const { id } = await params;
    const data = cambiarEstadoTarjetaSchema.parse({
      ...body,
      idTarjeta: id,
    });

    await db.query("CALL pa_cambiar_estado_tarjeta($1, $2)", [
      data.idTarjeta,
      data.estado,
    ]);

    return apiResponse(
      { data: null, error: null, msg: "Estado de la tarjeta actualizado" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}
