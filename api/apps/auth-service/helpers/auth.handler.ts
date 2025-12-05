import { Context } from "hono";
import {
  iniciarSesion,
  registrarPersona,
  obtenerPersonas,
  actualizarPersona,
  registrarUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  actualizarPasswordUsuario,
} from "../modules/auth.module";
import {
  apiResponse,
  apiResponseError,
  AuthServiceError,
  ErrorCodes,
} from "@packages/common-http";
import { requireAuth } from "@packages/jwt";

// Login con nombre de usuario y contraseña
export async function iniciarSesionHandler(c: Context) {
  try {
    const cred = await c.req.json();
    const result = await iniciarSesion(cred);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Registrar persona (solo superAdmin)
export async function registrarPersonaHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new AuthServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para registrar personas"
      );
    }

    const data = await c.req.json();
    const result = await registrarPersona(data);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 201 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Obtener todas las personas (solo superAdmin)
export async function obtenerPersonasHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new AuthServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para listar personas"
      );
    }

    const result = await obtenerPersonas();
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Actualizar persona (solo superAdmin)
export async function actualizarPersonaHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new AuthServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para actualizar personas"
      );
    }

    const data = await c.req.json();
    const result = await actualizarPersona(data);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Registrar usuario (solo superAdmin)
export async function registrarUsuarioHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new AuthServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para registrar usuarios"
      );
    }

    const data = await c.req.json();
    const result = await registrarUsuario(data);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 201 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Obtener todos los usuarios (solo superAdmin)
export async function obtenerUsuariosHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new AuthServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para listar usuarios"
      );
    }

    const result = await obtenerUsuarios();
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Actualizar usuario - nombre y estado (solo superAdmin)
export async function actualizarUsuarioHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new AuthServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para actualizar usuarios"
      );
    }

    const data = await c.req.json();
    const result = await actualizarUsuario(data);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Actualizar contraseña de usuario (solo superAdmin)
export async function actualizarPasswordUsuarioHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    const personaId = c.req.param("personaId");
    if (!claims.EsSuperAdmin()) {
      throw new AuthServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para actualizar contraseñas"
      );
    }

    const data = await c.req.json();
    const result = await actualizarPasswordUsuario({
      ...data,
      personaId: personaId,
    });
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}
