import { ZodError } from "zod";
import apiResponse from "../utils/apiResponse";
import { AuthError } from "../types/errors";

const isProd = process.env.NODE_ENV === "production";

export default function apiResponseError(error: unknown) {
  // Si es un error del JWT
  if (error instanceof AuthError) {
    return apiResponse(
      { data: null, error: error.message, msg: "No autorizado" },
      { status: 401 }
    );
  }
  // Si es un error de validación de Zod
  if (error instanceof ZodError) {
    const validacionDeErrores = error.errors.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));

    return apiResponse(
      {
        data: null,
        error: validacionDeErrores,
        msg: "Error de validación",
      },
      { status: 400 }
    );
  }

  // Cualquier otro error
  const errMsg = error instanceof Error ? error.message : "Error desconocido";
  console.error("Error:", errMsg);

  return apiResponse(
    {
      data: null,
      error: isProd ? "Error inesperado" : errMsg,
      msg: "Error interno del servidor",
    },
    { status: 500 }
  );
}
