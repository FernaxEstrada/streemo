import {
  registrarCupoVendidoSchema,
  cambiarEstadoCupoVendidoSchema,
  cambiarPlanCupoCupoVendidoSchema,
  cambiarMetodoPagoCupoVendidoSchema,
  actualizarCupoVendidoSchema,
} from "../schemas/quotas.schema";
import {
  createCupoVendido,
  getAllCuposVendidosWithRelations,
  updateCupoVendidoEstado,
  updateCupoVendidoPlan,
  updateCupoVendidoDatos,
  updateCupoVendidoMetodoPago,
} from "@packages/db";
import {
  QuotasServiceError,
  ErrorCodes,
  formatDateToDD_MM_YYYY,
} from "@packages/common-http";

// Registrar cupo vendido (solo superAdmin)
export async function registrarCupoVendido(data: any) {
  // 1. Validar con Zod
  const parsed = registrarCupoVendidoSchema.safeParse(data);
  if (!parsed.success) {
    throw new QuotasServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const {
    personaId,
    planPrincipalId,
    planCupoId,
    metodoPagoId,
    usuario,
    fechaInicio,
    nota,
  } = parsed.data;

  // 2. Crear cupo vendido
  let nuevoCupoVendido: any;
  try {
    nuevoCupoVendido = await createCupoVendido(
      personaId,
      planPrincipalId,
      planCupoId,
      metodoPagoId,
      usuario,
      fechaInicio,
      nota
    );
  } catch (error) {
    throw new QuotasServiceError(
      ErrorCodes.DB_ERROR,
      "Ocurrió un error al guardar el cupo vendido",
      error
    );
  }

  // 3. Retornar
  return {
    id: nuevoCupoVendido.cveid,
    usuario: nuevoCupoVendido.cveusuario,
    fechaInicio: formatDateToDD_MM_YYYY(nuevoCupoVendido.cvefechainicio),
    proxPago: nuevoCupoVendido.cveproxpago,
    nota: nuevoCupoVendido.cvenota,
    estado: nuevoCupoVendido.cveestado,
    personaId: nuevoCupoVendido.cveidpersona,
    planPrincipalId: nuevoCupoVendido.cveidplanp,
    planCupoId: nuevoCupoVendido.cveidplancupo,
    metodoPagoId: nuevoCupoVendido.cveidmetpago,
  };
}

// Obtener todos los cupos vendidos (solo superAdmin)
export async function obtenerCuposVendidos() {
  let cuposVendidos: any[] = [];
  try {
    cuposVendidos = await getAllCuposVendidosWithRelations();
  } catch (error) {
    throw new QuotasServiceError(
      ErrorCodes.DB_ERROR,
      "No fue posible consultar los cupos vendidos",
      error
    );
  }

  return cuposVendidos.map((row) => ({
    id: row.cupovendido.cveid,
    usuario: row.cupovendido.cveusuario,
    fechaInicio: formatDateToDD_MM_YYYY(row.cupovendido.cvefechainicio),
    proxPago: formatDateToDD_MM_YYYY(row.cupovendido.cveproxpago),
    nota: row.cupovendido.cvenota,
    estado: row.cupovendido.cveestado,
    persona: {
      id: row.persona.perid,
      nombres: row.persona.pernombres,
      apellidos: row.persona.perapellidos,
      telefono: row.persona.pertelefono,
    },
    planPrincipal: {
      id: row.planprincipal.priid,
      nombre: row.planprincipal.prinombre,
    },
    planCupo: {
      id: row.plancupo.cupid,
      nombre: row.plancupo.cupnombre,
      precio: row.plancupo.cupprecio,
    },
    metodoPago: {
      id: row.metodopago.mtpid,
      nombre: row.metodopago.mtpnombre,
    },
  }));
}

// Cambiar estado de cupo vendido (solo superAdmin)
export async function cambiarEstadoCupoVendido(data: any) {
  // 1. Validar con Zod
  const parsed = cambiarEstadoCupoVendidoSchema.safeParse(data);
  if (!parsed.success) {
    throw new QuotasServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const { id, estado } = parsed.data;

  // 2. Cambiar estado
  let cupoVendidoActualizado: any;
  try {
    cupoVendidoActualizado = await updateCupoVendidoEstado(id, estado);
  } catch (error) {
    throw new QuotasServiceError(
      ErrorCodes.DB_ERROR,
      "Ocurrió un error al cambiar el estado del cupo vendido",
      error
    );
  }

  // 3. Retornar
  return {
    id: cupoVendidoActualizado.cveid,
    estado: cupoVendidoActualizado.cveestado,
  };
}

// Cambiar plan cupo de cupo vendido (solo superAdmin)
export async function cambiarPlanCupoCupoVendido(data: any) {
  // 1. Validar con Zod
  const parsed = cambiarPlanCupoCupoVendidoSchema.safeParse(data);
  if (!parsed.success) {
    throw new QuotasServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const { id, planCupoId } = parsed.data;

  // 2. Cambiar plan cupo
  let cupoVendidoActualizado: any;
  try {
    cupoVendidoActualizado = await updateCupoVendidoPlan(id, planCupoId);
  } catch (error) {
    throw new QuotasServiceError(
      ErrorCodes.DB_ERROR,
      "Ocurrió un error al cambiar el plan cupo",
      error
    );
  }

  // 3. Retornar
  return {
    id: cupoVendidoActualizado.cveid,
    planCupoId: cupoVendidoActualizado.cveidplancupo,
  };
}

// Cambiar método de pago de cupo vendido (solo superAdmin)
export async function cambiarMetodoPagoCupoVendido(data: any) {
  // 1. Validar con Zod
  const parsed = cambiarMetodoPagoCupoVendidoSchema.safeParse(data);
  if (!parsed.success) {
    throw new QuotasServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const { id, metodoPagoId } = parsed.data;

  // 2. Cambiar método de pago
  let cupoVendidoActualizado: any;
  try {
    cupoVendidoActualizado = await updateCupoVendidoMetodoPago(
      id,
      metodoPagoId
    );
  } catch (error) {
    throw new QuotasServiceError(
      ErrorCodes.DB_ERROR,
      "Ocurrió un error al cambiar el método de pago",
      error
    );
  }

  // 3. Retornar
  return {
    id: cupoVendidoActualizado.cveid,
    metodoPagoId: cupoVendidoActualizado.cveidmetpago,
  };
}

// Actualizar datos de cupo vendido (solo superAdmin)
export async function actualizarCupoVendido(data: any) {
  // 1. Validar con Zod
  const parsed = actualizarCupoVendidoSchema.safeParse(data);
  if (!parsed.success) {
    throw new QuotasServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const { id, usuario, nota } = parsed.data;

  // 2. Validar que al menos un campo sea proporcionado
  if (!usuario && !nota) {
    throw new QuotasServiceError(
      ErrorCodes.VALIDATION_ERROR,
      "Debe proporcionar al menos un campo para actualizar"
    );
  }

  // 3. Actualizar datos
  let cupoVendidoActualizado: any;
  try {
    cupoVendidoActualizado = await updateCupoVendidoDatos(
      id,
      usuario || "",
      nota
    );
  } catch (error) {
    throw new QuotasServiceError(
      ErrorCodes.DB_ERROR,
      "Ocurrió un error al actualizar el cupo vendido",
      error
    );
  }

  // 4. Retornar
  return {
    id: cupoVendidoActualizado.cveid,
    usuario: cupoVendidoActualizado.cveusuario,
    nota: cupoVendidoActualizado.cvenota,
  };
}
