import { NextRequest } from "next/server";
import { db } from "../../../utils/db";
import apiResponse from "../../../utils/apiResponse";
import apiResponseError from "../../../utils/apiResponseError";
import { cambiarMetodoPagoCupoVendidoSchema } from "@/app/api/schemas/cupo-vendido";
import { Params } from "@/app/api/types/params";
import { authGuard } from "@/app/api/lib/auth/authGuard";

export const dynamic = "force-dynamic";

// Cambiar metodo de pago cupo
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await authGuard(req);

    const body = await req.json();
    const { id } = await params;
    const data = cambiarMetodoPagoCupoVendidoSchema.parse({
      ...body,
      idCupo: id,
    });

    await db.query("CALL pa_cambiar_metodo_pago_cupo_vendido($1, $2)", [
      data.idCupo,
      data.idMetPago,
    ]);

    return apiResponse(
      {
        data: null,
        error: null,
        msg: "Método de pago del cupo actualizado correctamente",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}
