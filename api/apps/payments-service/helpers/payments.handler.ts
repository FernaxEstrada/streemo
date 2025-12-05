import { Context } from "hono";
import {
  registrarMetodoPago,
  obtenerMetodosPago,
  actualizarMetodoPago,
  registrarTarjeta,
  obtenerTarjetas,
  actualizarEstadoTarjeta,
} from "../modules/payments.module";
import {
  apiResponse,
  apiResponseError,
  PaymentsServiceError,
  ErrorCodes,
} from "@packages/common-http";
import { requireAuth } from "@packages/jwt";

// Registrar método de pago (solo superAdmin)
export async function registrarMetodoPagoHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new PaymentsServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para registrar métodos de pago"
      );
    }

    const data = await c.req.json();
    const result = await registrarMetodoPago(data);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 201 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Obtener todos los métodos de pago (solo superAdmin)
export async function obtenerMetodosPagoHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new PaymentsServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para listar métodos de pago"
      );
    }

    const result = await obtenerMetodosPago();
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Actualizar método de pago (solo superAdmin)
export async function actualizarMetodoPagoHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new PaymentsServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para actualizar métodos de pago"
      );
    }

    const data = await c.req.json();
    const result = await actualizarMetodoPago(data);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Registrar tarjeta (solo superAdmin)
export async function registrarTarjetaHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new PaymentsServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para registrar tarjetas"
      );
    }

    const data = await c.req.json();
    const result = await registrarTarjeta(data);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 201 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Obtener todas las tarjetas (solo superAdmin)
export async function obtenerTarjetasHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new PaymentsServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para listar tarjetas"
      );
    }

    const result = await obtenerTarjetas();
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Actualizar estado de tarjeta (solo superAdmin)
export async function actualizarEstadoTarjetaHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new PaymentsServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para actualizar tarjetas"
      );
    }

    const data = await c.req.json();
    const result = await actualizarEstadoTarjeta(data);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}
