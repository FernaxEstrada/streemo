import { NextRequest } from "next/server";
import apiResponse from "../../utils/apiResponse";
import apiResponseError from "../../utils/apiResponseError";
import { iniciarSesionUsuarioSchema } from "../../schemas/usuario";
import { db } from "../../utils/db";
import { compare } from "bcryptjs";
import { generateToken } from "../../lib/auth/generateToken";

export const dynamic = "force-dynamic";

// Iniciar sesion
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = iniciarSesionUsuarioSchema.parse(body);

    const result = await db.query(
      `SELECT 
          u.IdPersona, 
          u.Usuario, 
          u.Contrasena, 
          u.Estado AS EstadoUsuario, 
          p.Nombres,
          p.Apellidos,
          p.Estado AS EstadoPersona 
        FROM Usuario u 
        JOIN Persona p ON u.IdPersona = p.IdPersona 
        WHERE u.Usuario = $1`,
      [data.usuario]
    );

    const dataResult = result.rows[0];

    if (!dataResult) {
      return apiResponse(
        {
          data: null,
          error: "Usuario no encontrado",
          msg: "El usuario ingresado no existe en el sistema",
        },
        { status: 401 }
      );
    }

    if (!dataResult.estadousuario || !dataResult.estadopersona) {
      return apiResponse(
        {
          data: null,
          error: "Cuenta inactiva",
          msg: "El usuario ingresado no se encuentra activo",
        },
        { status: 401 }
      );
    }

    const passwordMatch = await compare(data.contrasena, dataResult.contrasena);

    if (!passwordMatch) {
      return apiResponse(
        {
          data: null,
          error: "Contraseña incorrecta",
          msg: "La contraseña ingresada es incorrecta",
        },
        { status: 401 }
      );
    }

    const token = generateToken({
      id: dataResult.idpersona,
      nombre: dataResult.nombres,
      apellido: dataResult.apellidos,
      usuario: dataResult.usuario,
    });

    return apiResponse(
      { data: token, error: null, msg: "Sesión iniciada con éxito" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}
