import { Context } from "hono";
import {
  registrarCupoVendido,
  obtenerCuposVendidos,
  cambiarEstadoCupoVendido,
  cambiarPlanCupoCupoVendido,
  cambiarMetodoPagoCupoVendido,
  actualizarCupoVendido,
} from "../modules/quotas.module";
import {
  apiResponse,
  apiResponseError,
  QuotasServiceError,
  ErrorCodes,
} from "@packages/common-http";
import { requireAuth } from "@packages/jwt";

// Registrar cupo vendido (solo superAdmin)
export async function registrarCupoVendidoHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new QuotasServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para registrar cupos vendidos"
      );
    }

    const data = await c.req.json();
    const result = await registrarCupoVendido(data);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 201 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Obtener cupos vendidos (solo superAdmin)
export async function obtenerCuposVendidosHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new QuotasServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para listar cupos vendidos"
      );
    }

    const result = await obtenerCuposVendidos();
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Cambiar estado de cupo vendido (solo superAdmin)
export async function cambiarEstadoCupoVendidoHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new QuotasServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para cambiar el estado de cupos vendidos"
      );
    }

    const data = await c.req.json();
    const result = await cambiarEstadoCupoVendido(data);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Cambiar plan cupo de cupo vendido (solo superAdmin)
export async function cambiarPlanCupoCupoVendidoHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new QuotasServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para cambiar el plan cupo"
      );
    }

    const data = await c.req.json();
    const result = await cambiarPlanCupoCupoVendido(data);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Cambiar método de pago de cupo vendido (solo superAdmin)
export async function cambiarMetodoPagoCupoVendidoHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new QuotasServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para cambiar el método de pago"
      );
    }

    const data = await c.req.json();
    const result = await cambiarMetodoPagoCupoVendido(data);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Actualizar datos de cupo vendido (solo superAdmin)
export async function actualizarCupoVendidoHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new QuotasServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para actualizar cupos vendidos"
      );
    }

    const data = await c.req.json();
    const result = await actualizarCupoVendido(data);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}
