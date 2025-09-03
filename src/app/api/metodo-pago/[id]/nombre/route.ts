import { NextRequest } from "next/server";
import { db } from "../../../utils/db";
import apiResponse from "../../../utils/apiResponse";
import apiResponseError from "../../../utils/apiResponseError";
import { actualizarNombreMetodoPagoSchema } from "@/app/api/schemas/metodo-pago";
import { Params } from "@/app/api/types/params";
import { authGuard } from "@/app/api/lib/auth/authGuard";

export const dynamic = "force-dynamic";

// Actualizar nombre de metodo de pago
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await authGuard(req);

    const body = await req.json();
    const { id } = await params;
    const data = actualizarNombreMetodoPagoSchema.parse({
      ...body,
      idMetPago: id,
    });

    await db.query("CALL pa_actualizar_metodo_pago($1, $2)", [
      data.idMetPago,
      data.nombre,
    ]);

    return apiResponse(
      { data: null, error: null, msg: "Método de pago actualizado" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}
