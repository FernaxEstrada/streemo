import { NextRequest } from "next/server";
import { actualizarNombreUsuarioSchema } from "../../../schemas/usuario";
import { db } from "../../../utils/db";
import apiResponse from "../../../utils/apiResponse";
import apiResponseError from "../../../utils/apiResponseError";
import { Params } from "@/app/api/types/params";
import { authGuard } from "@/app/api/lib/auth/authGuard";

export const dynamic = "force-dynamic";

// Actualizar nombre de usuario
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await authGuard(req);

    const body = await req.json();
    const { id } = await params;
    const data = actualizarNombreUsuarioSchema.parse({
      ...body,
      idPersona: id,
    });

    await db.query("CALL pa_actualizar_usuario($1, $2)", [
      data.idPersona,
      data.nuevoUsuario,
    ]);

    return apiResponse(
      { data: null, error: null, msg: "Nombre de usuario actualizado" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}
