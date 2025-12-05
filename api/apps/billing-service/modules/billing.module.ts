import {
  registrarPagoPlanPSchema,
  cambiarEstadoPagoPlanPSchema,
  actualizarNotaPagoPlanPSchema,
  registrarPagoCupoSchema,
  cambiarEstadoPagoCupoSchema,
  actualizarNotaPagoCupoSchema,
} from "../schemas/billing.schema";
import {
  createPagoPlanP,
  getAllPagosPlanPWithRelations,
  updatePagoPlanPEstado,
  updatePagoPlanPNota,
  createPagoCupo,
  getAllPagosCupoWithRelations,
  updatePagoCupoEstado,
  updatePagoCupoNota,
} from "@packages/db";
import {
  BillingServiceError,
  ErrorCodes,
  formatDateToDD_MM_YYYY,
  formatDateToDDMMYYYY,
} from "@packages/common-http";

// Registrar pago de plan principal (solo superAdmin)
export async function registrarPagoPlanP(data: any) {
  // 1. Validar con Zod
  const parsed = registrarPagoPlanPSchema.safeParse(data);
  if (!parsed.success) {
    throw new BillingServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const { planPrincipalId, fechaPago, nota } = parsed.data;

  // 2. Crear pago de plan principal
  let nuevoPagoPlanP: any;
  try {
    nuevoPagoPlanP = await createPagoPlanP(planPrincipalId, fechaPago, nota);
  } catch (error) {
    throw new BillingServiceError(
      ErrorCodes.DB_ERROR,
      "Ocurrió un error al guardar el pago",
      error
    );
  }

  // 3. Retornar
  return {
    id: nuevoPagoPlanP.pgpid,
    fechaFacturacion: formatDateToDD_MM_YYYY(
      nuevoPagoPlanP.pgpfechafacturacion
    ),
    fechaPago: formatDateToDDMMYYYY(nuevoPagoPlanP.pgpfechapago),
    monto: nuevoPagoPlanP.pgpmonto,
    metodoPago: nuevoPagoPlanP.pgpmetodopago,
    tarjeta: nuevoPagoPlanP.pgptarjeta,
    nota: nuevoPagoPlanP.pgpnota,
    estado: nuevoPagoPlanP.pgpestado,
    planPrincipalId: nuevoPagoPlanP.pgpidplanp,
  };
}

// Obtener todos los pagos de planes principales (solo superAdmin)
export async function obtenerPagosPlanP() {
  let pagosPlanP: any[] = [];
  try {
    pagosPlanP = await getAllPagosPlanPWithRelations();
  } catch (error) {
    throw new BillingServiceError(
      ErrorCodes.DB_ERROR,
      "No fue posible consultar los pagos",
      error
    );
  }

  return pagosPlanP.map((row) => ({
    id: row.pagoplanp.pgpid,
    fechaFacturacion: formatDateToDD_MM_YYYY(row.pagoplanp.pgpfechafacturacion),
    fechaPago: formatDateToDDMMYYYY(row.pagoplanp.pgpfechapago),
    monto: row.pagoplanp.pgpmonto,
    metodoPago: row.pagoplanp.pgpmetodopago,
    tarjeta: row.pagoplanp.pgptarjeta,
    nota: row.pagoplanp.pgpnota,
    estado: row.pagoplanp.pgpestado,
    planPrincipal: {
      id: row.planprincipal.priid,
      nombre: row.planprincipal.prinombre,
    },
  }));
}

// Cambiar estado de pago de plan principal (solo superAdmin)
export async function cambiarEstadoPagoPlanP(data: any) {
  // 1. Validar con Zod
  const parsed = cambiarEstadoPagoPlanPSchema.safeParse(data);
  if (!parsed.success) {
    throw new BillingServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const { id, estado } = parsed.data;

  // 2. Cambiar estado
  let pagoPlanPActualizado: any;
  try {
    pagoPlanPActualizado = await updatePagoPlanPEstado(id, estado);
  } catch (error) {
    throw new BillingServiceError(
      ErrorCodes.DB_ERROR,
      "Ocurrió un error al cambiar el estado del pago",
      error
    );
  }

  // 3. Retornar
  return {
    id: pagoPlanPActualizado.pgpid,
    estado: pagoPlanPActualizado.pgpestado,
  };
}

// Actualizar nota de pago de plan principal (solo superAdmin)
export async function actualizarNotaPagoPlanP(data: any) {
  // 1. Validar con Zod
  const parsed = actualizarNotaPagoPlanPSchema.safeParse(data);
  if (!parsed.success) {
    throw new BillingServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const { id, nota } = parsed.data;

  // 2. Actualizar nota
  let pagoPlanPActualizado: any;
  try {
    pagoPlanPActualizado = await updatePagoPlanPNota(id, nota);
  } catch (error) {
    throw new BillingServiceError(
      ErrorCodes.DB_ERROR,
      "Ocurrió un error al actualizar la nota del pago",
      error
    );
  }

  // 3. Retornar
  return {
    id: pagoPlanPActualizado.pgpid,
    nota: pagoPlanPActualizado.pgpnota,
  };
}

// Registrar pago de cupo (solo superAdmin)
export async function registrarPagoCupo(data: any) {
  // 1. Validar con Zod
  const parsed = registrarPagoCupoSchema.safeParse(data);
  if (!parsed.success) {
    throw new BillingServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const { cupoVendidoId, fechaPago, nota } = parsed.data;

  // 2. Crear pago de cupo
  let nuevoPagoCupo: any;
  try {
    nuevoPagoCupo = await createPagoCupo(cupoVendidoId, fechaPago, nota);
  } catch (error) {
    throw new BillingServiceError(
      ErrorCodes.DB_ERROR,
      "Ocurrió un error al guardar el pago",
      error
    );
  }

  // 3. Retornar
  return {
    id: nuevoPagoCupo.pgcid,
    fechaFacturacion: formatDateToDD_MM_YYYY(nuevoPagoCupo.pgcfechafacturacion),
    fechaPago: formatDateToDDMMYYYY(nuevoPagoCupo.pgcfechapago),
    mesesPagados: nuevoPagoCupo.pgcmesespagados,
    monto: nuevoPagoCupo.pgcmonto,
    metodoPago: nuevoPagoCupo.pgcmetodopago,
    nota: nuevoPagoCupo.pgcnota,
    estado: nuevoPagoCupo.pgcestado,
    cupoVendidoId: nuevoPagoCupo.pgcidcupovendido,
  };
}

// Obtener todos los pagos de cupos (solo superAdmin)
export async function obtenerPagosCupo() {
  let pagosCupo: any[] = [];
  try {
    pagosCupo = await getAllPagosCupoWithRelations();
  } catch (error) {
    throw new BillingServiceError(
      ErrorCodes.DB_ERROR,
      "No fue posible consultar los pagos",
      error
    );
  }

  return pagosCupo.map((row) => ({
    id: row.pagocupo.pgcid,
    fechaFacturacion: formatDateToDD_MM_YYYY(row.pagocupo.pgcfechafacturacion),
    fechaPago: formatDateToDDMMYYYY(row.pagocupo.pgcfechapago),
    mesesPagados: row.pagocupo.pgcmesespagados,
    metodoPago: row.pagocupo.pgcmetodopago,
    nota: row.pagocupo.pgcnota,
    estado: row.pagocupo.pgcestado,
    cupoVendido: {
      id: row.cupovendido.cveid,
      usuario: row.cupovendido.cveusuario,
    },
  }));
}

// Cambiar estado de pago de cupo (solo superAdmin)
export async function cambiarEstadoPagoCupo(data: any) {
  // 1. Validar con Zod
  const parsed = cambiarEstadoPagoCupoSchema.safeParse(data);
  if (!parsed.success) {
    throw new BillingServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const { id, estado } = parsed.data;

  // 2. Cambiar estado
  let pagoCupoActualizado: any;
  try {
    pagoCupoActualizado = await updatePagoCupoEstado(id, estado);
  } catch (error) {
    throw new BillingServiceError(
      ErrorCodes.DB_ERROR,
      "Ocurrió un error al cambiar el estado del pago",
      error
    );
  }

  // 3. Retornar
  return {
    id: pagoCupoActualizado.pgcid,
    estado: pagoCupoActualizado.pgcestado,
  };
}

// Actualizar nota de pago de cupo (solo superAdmin)
export async function actualizarNotaPagoCupo(data: any) {
  // 1. Validar con Zod
  const parsed = actualizarNotaPagoCupoSchema.safeParse(data);
  if (!parsed.success) {
    throw new BillingServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const { id, nota } = parsed.data;

  // 2. Actualizar nota
  let pagoCupoActualizado: any;
  try {
    pagoCupoActualizado = await updatePagoCupoNota(id, nota);
  } catch (error) {
    throw new BillingServiceError(
      ErrorCodes.DB_ERROR,
      "Ocurrió un error al actualizar la nota del pago",
      error
    );
  }

  // 3. Retornar
  return {
    id: pagoCupoActualizado.pgcid,
    nota: pagoCupoActualizado.pgcnota,
  };
}
