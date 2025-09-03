import { NextRequest } from "next/server";
import { actualizarContrasenaUsuarioSchema } from "../../../schemas/usuario";
import { db } from "../../../utils/db";
import apiResponse from "../../../utils/apiResponse";
import apiResponseError from "../../../utils/apiResponseError";
import bcrypt from "bcryptjs";
import { Params } from "@/app/api/types/params";
import { authGuard } from "@/app/api/lib/auth/authGuard";

export const dynamic = "force-dynamic";

// Actualizar contrasena de usuario
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await authGuard(req);

    const body = await req.json();
    const { id } = await params;
    const data = actualizarContrasenaUsuarioSchema.parse({
      ...body,
      idPersona: id,
    });

    const hashedNewContrasena = await bcrypt.hash(data.nuevaContrasena, 10);

    await db.query("CALL pa_actualizar_contrasena($1, $2)", [
      data.idPersona,
      hashedNewContrasena,
    ]);

    return apiResponse(
      { data: null, error: null, msg: "Contraseña actualizada" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}
