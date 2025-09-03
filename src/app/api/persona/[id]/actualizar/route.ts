import { NextRequest } from "next/server";
import { db } from "../../../utils/db";
import { actualizarDatosPersonaSchema } from "@/app/api/schemas/persona";
import apiResponse from "@/app/api/utils/apiResponse";
import apiResponseError from "@/app/api/utils/apiResponseError";
import { Params } from "@/app/api/types/params";
import { authGuard } from "@/app/api/lib/auth/authGuard";

export const dynamic = "force-dynamic";

// Actualizar datos personales persona
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await authGuard(req);

    const body = await req.json();
    const { id } = await params;
    const data = actualizarDatosPersonaSchema.parse({
      ...body,
      idPersona: id,
    });

    await db.query("CALL pa_actualizar_datos_persona($1, $2, $3, $4, $5)", [
      data.idPersona,
      data.nombres,
      data.apellidos,
      data.telefono,
      data.sexo,
    ]);

    return apiResponse(
      { data: null, error: null, msg: "Datos de la persona actualizados" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}
