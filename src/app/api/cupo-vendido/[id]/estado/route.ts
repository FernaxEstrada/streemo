import { NextRequest } from "next/server";
import { db } from "../../../utils/db";
import apiResponse from "@/app/api/utils/apiResponse";
import apiResponseError from "@/app/api/utils/apiResponseError";
import { cambiarEstadoCupoVendidoSchema } from "@/app/api/schemas/cupo-vendido";
import { Params } from "@/app/api/types/params";
import { authGuard } from "@/app/api/lib/auth/authGuard";

export const dynamic = "force-dynamic";

// Cambiar estado cupo vendido
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await authGuard(req);

    const body = await req.json();
    const { id } = await params;
    const data = cambiarEstadoCupoVendidoSchema.parse({
      ...body,
      idCupo: id,
    });

    await db.query("CALL pa_cambiar_estado_cupo_vendido($1, $2)", [
      data.idCupo,
      data.estado,
    ]);

    return apiResponse(
      { data: null, error: null, msg: "Estado del cupo actualizado" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}
