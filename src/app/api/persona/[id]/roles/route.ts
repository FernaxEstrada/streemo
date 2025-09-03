import { NextRequest } from "next/server";
import { db } from "../../../utils/db";
import { actualizarRolesPersonaSchema } from "@/app/api/schemas/persona";
import apiResponse from "@/app/api/utils/apiResponse";
import apiResponseError from "@/app/api/utils/apiResponseError";
import { Params } from "@/app/api/types/params";
import { authGuard } from "@/app/api/lib/auth/authGuard";

export const dynamic = "force-dynamic";

// Actualizar roles persona
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await authGuard(req);

    const body = await req.json();
    const { id } = await params;
    const data = actualizarRolesPersonaSchema.parse({
      ...body,
      idPersona: id,
    });

    await db.query("CALL pa_actualizar_roles_persona($1, $2, $3, $4)", [
      data.idPersona,
      data.tipoap,
      data.tipoc,
      data.tiposa,
    ]);

    return apiResponse(
      { data: null, error: null, msg: "Roles de la persona actualizados" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}
