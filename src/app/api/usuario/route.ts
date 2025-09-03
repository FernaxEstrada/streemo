import { db } from "../utils/db";
import apiResponse from "../utils/apiResponse";
import apiResponseError from "../utils/apiResponseError";
import { NextRequest } from "next/server";
import { registrarUsuarioSchema } from "../schemas/usuario";
import bcrypt from "bcryptjs";
import { authGuard } from "../lib/auth/authGuard";
import { mapUsuario } from "../lib/mappers/usuario";

export const dynamic = "force-dynamic";

// Registrar usuario
export async function POST(req: NextRequest) {
  try {
    await authGuard(req);

    const body = await req.json();
    const data = registrarUsuarioSchema.parse(body);

    const hashedContrasena = await bcrypt.hash(data.contrasena, 10);

    await db.query("CALL pa_crear_usuario($1, $2, $3)", [
      data.idPersona,
      data.usuario,
      hashedContrasena,
    ]);

    return apiResponse(
      { data: null, error: null, msg: "Usuario Registrado" },
      { status: 201 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}

// Obtener usuarios
export async function GET(req: NextRequest) {
  try {
    await authGuard(req);

    const result = await db.query(`
      SELECT 
        u.idpersona,
        u.usuario,
        u.estado AS estadousuario,
        
        p.nombres,
        p.apellidos,
        p.telefono,
        p.sexo,
        p.tipoap,
        p.tipoc,
        p.tiposa,
        p.estado AS estadopersona
      FROM usuario u
      JOIN persona p ON u.idpersona = p.idpersona
      `);

    const usuarios = result.rows.map(mapUsuario);

    return apiResponse(
      { data: usuarios, error: null, msg: "ok!" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(error);
  }
}
