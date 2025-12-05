import { Context } from "hono";
import {
  registrarPlanPrincipal,
  obtenerPlanesPrincipales,
  actualizarPlanPrincipal,
  cambiarEstadoPlanPrincipal,
  cambiarMetodoPagoPlan,
  cambiarTarjetaPlan,
  registrarPlanCupo,
  obtenerPlanesCupo,
  actualizarPlanCupo,
  cambiarEstadoPlanCupo,
} from "../modules/plans.module";
import {
  apiResponse,
  apiResponseError,
  PlansServiceError,
  ErrorCodes,
} from "@packages/common-http";
import { requireAuth } from "@packages/jwt";

// Registrar plan principal (solo superAdmin)
export async function registrarPlanPrincipalHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new PlansServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para registrar planes principales"
      );
    }

    const data = await c.req.json();
    const result = await registrarPlanPrincipal(data);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 201 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Obtener planes principales (solo superAdmin)
export async function obtenerPlanesPrincipalesHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new PlansServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para listar planes principales"
      );
    }

    const result = await obtenerPlanesPrincipales();
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Actualizar plan principal (solo superAdmin)
export async function actualizarPlanPrincipalHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new PlansServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para actualizar planes principales"
      );
    }

    const data = await c.req.json();
    const result = await actualizarPlanPrincipal(data);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Cambiar estado de plan principal (solo superAdmin)
export async function cambiarEstadoPlanPrincipalHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new PlansServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para cambiar el estado de planes"
      );
    }

    const data = await c.req.json();
    const result = await cambiarEstadoPlanPrincipal(data);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Cambiar método de pago de plan principal (solo superAdmin)
export async function cambiarMetodoPagoPlanHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new PlansServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para cambiar el método de pago"
      );
    }

    const data = await c.req.json();
    const result = await cambiarMetodoPagoPlan(data);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Cambiar tarjeta de plan principal (solo superAdmin)
export async function cambiarTarjetaPlanHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new PlansServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para cambiar la tarjeta"
      );
    }

    const data = await c.req.json();
    const result = await cambiarTarjetaPlan(data);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Registrar plan cupo (solo superAdmin)
export async function registrarPlanCupoHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new PlansServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para registrar planes cupo"
      );
    }

    const data = await c.req.json();
    const result = await registrarPlanCupo(data);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 201 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Obtener planes cupo (solo superAdmin)
export async function obtenerPlanesCupoHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new PlansServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para listar planes cupo"
      );
    }

    const result = await obtenerPlanesCupo();
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Actualizar plan cupo (solo superAdmin)
export async function actualizarPlanCupoHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new PlansServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para actualizar planes cupo"
      );
    }

    const data = await c.req.json();
    const result = await actualizarPlanCupo(data);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}

// Cambiar estado de plan cupo (solo superAdmin)
export async function cambiarEstadoPlanCupoHandler(c: Context) {
  try {
    const claims = requireAuth(c);
    if (!claims.EsSuperAdmin()) {
      throw new PlansServiceError(
        ErrorCodes.PERMISSION_DENIED,
        "No tiene permiso para cambiar el estado de planes cupo"
      );
    }

    const data = await c.req.json();
    const result = await cambiarEstadoPlanCupo(data);
    return apiResponse(
      { response: c },
      { data: result, error: null, ok: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    return apiResponseError(c, error);
  }
}
