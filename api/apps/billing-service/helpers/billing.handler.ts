import { Context } from "hono";
import {
  registrarPagoPlanP,
  obtenerPagosPlanP,
  cambiarEstadoPagoPlanP,
  actualizarNotaPagoPlanP,
  registrarPagoCupo,
  obtenerPagosCupo,
  cambiarEstadoPagoCupo,
  actualizarNotaPagoCupo,
} from "../modules/billing.module";
import {
  apiResponse,
  apiResponseError,
  BillingServiceError,
  ErrorCodes,
} from "@packages/common-http";
import { requireAuth } from "@packages/jwt";

// Registrar pago de plan principal (solo superAdmin)
export async function registrarPagoPlanPHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new BillingServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para registrar pagos"
      );
    }

    const data = await c.req.json();
    const result = await registrarPagoPlanP(data);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 201 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Obtener pagos de planes principales (solo superAdmin)
export async function obtenerPagosPlanPHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new BillingServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para listar pagos"
      );
    }

    const result = await obtenerPagosPlanP();
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Cambiar estado de pago de plan principal (solo superAdmin)
export async function cambiarEstadoPagoPlanPHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new BillingServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para cambiar el estado de pagos"
      );
    }

    const data = await c.req.json();
    const result = await cambiarEstadoPagoPlanP(data);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Actualizar nota de pago de plan principal (solo superAdmin)
export async function actualizarNotaPagoPlanPHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new BillingServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para actualizar notas de pagos"
      );
    }

    const data = await c.req.json();
    const result = await actualizarNotaPagoPlanP(data);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Registrar pago de cupo (solo superAdmin)
export async function registrarPagoCupoHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new BillingServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para registrar pagos"
      );
    }

    const data = await c.req.json();
    const result = await registrarPagoCupo(data);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 201 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Obtener pagos de cupos (solo superAdmin)
export async function obtenerPagosCupoHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new BillingServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para listar pagos"
      );
    }

    const result = await obtenerPagosCupo();
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Cambiar estado de pago de cupo (solo superAdmin)
export async function cambiarEstadoPagoCupoHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new BillingServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para cambiar el estado de pagos"
      );
    }

    const data = await c.req.json();
    const result = await cambiarEstadoPagoCupo(data);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Actualizar nota de pago de cupo (solo superAdmin)
export async function actualizarNotaPagoCupoHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new BillingServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para actualizar notas de pagos"
      );
    }

    const data = await c.req.json();
    const result = await actualizarNotaPagoCupo(data);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}
