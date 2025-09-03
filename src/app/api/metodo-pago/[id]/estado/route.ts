import { NextRequest } from "next/server";
import { db } from "../../../utils/db";
import apiResponse from "@/app/api/utils/apiResponse";
import apiResponseError from "@/app/api/utils/apiResponseError";
import { cambiarEstadoMetodoPagoSchema } from "@/app/api/schemas/metodo-pago";
import { Params } from "@/app/api/types/params";
import { authGuard } from "@/app/api/lib/auth/authGuard";

export const dynamic = "force-dynamic";

// Cambiar estado metodo de pago
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await authGuard(req);

    const body = await req.json();
    const { id } = await params;
    const data = cambiarEstadoMetodoPagoSchema.parse({
      ...body,
      idMetPago: id,
    });
    await db.query("CALL pa_cambiar_estado_metodo_pago($1, $2)", [
      data.idMetPago,
      data.estado,
    ]);

    return apiResponse(
      { data: null, error: null, msg: "Estado del método de pago actualizado" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}
