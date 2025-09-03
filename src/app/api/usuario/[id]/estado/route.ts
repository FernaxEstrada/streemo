import { NextRequest } from "next/server";
import { db } from "../../../utils/db";
import apiResponse from "@/app/api/utils/apiResponse";
import apiResponseError from "@/app/api/utils/apiResponseError";
import { cambiarEstadoUsuarioSchema } from "@/app/api/schemas/usuario";
import { Params } from "@/app/api/types/params";
import { authGuard } from "@/app/api/lib/auth/authGuard";

export const dynamic = "force-dynamic";

// Cambiar estado usuario
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await authGuard(req);

    const body = await req.json();
    const { id } = await params;
    const data = cambiarEstadoUsuarioSchema.parse({
      ...body,
      idPersona: id,
    });

    await db.query("CALL pa_cambiar_estado_usuario($1, $2)", [
      data.idPersona,
      data.estado,
    ]);

    return apiResponse(
      { data: null, error: null, msg: "Estado del usuario actualizado" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}
