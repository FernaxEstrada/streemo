import { NextRequest } from "next/server";
import { db } from "../../../utils/db";
import apiResponse from "../../../utils/apiResponse";
import apiResponseError from "../../../utils/apiResponseError";
import { actualizarDatosCupoVendidoSchema } from "@/app/api/schemas/cupo-vendido";
import { Params } from "@/app/api/types/params";
import { authGuard } from "@/app/api/lib/auth/authGuard";

export const dynamic = "force-dynamic";

// Actualizar datos del cupo vendido
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await authGuard(req);

    const body = await req.json();
    const { id } = await params;
    const data = actualizarDatosCupoVendidoSchema.parse({
      ...body,
      idCupo: id,
    });

    await db.query("CALL pa_actualizar_datos_cupo_vendido($1, $2, $3)", [
      data.idCupo,
      data.usuario,
      data.nota || null,
    ]);

    return apiResponse(
      {
        data: null,
        error: null,
        msg: "Datos del cupo actualizados correctamente",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}
