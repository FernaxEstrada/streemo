import {
  registrarPlanPrincipalSchema,
  actualizarPlanPrincipalSchema,
  cambiarEstadoPlanPrincipalSchema,
  cambiarMetodoPagoPlanSchema,
  cambiarTarjetaPlanSchema,
  registrarPlanCupoSchema,
  actualizarPlanCupoSchema,
  cambiarEstadoPlanCupoSchema,
} from "../schemas/plans.schema";
import {
  createPlanPrincipal,
  getAllPlanesPrincipalesWithRelations,
  updatePlanPrincipalDatos,
  updatePlanPrincipalEstado,
  updatePlanPrincipalMetodoPago,
  updatePlanPrincipalTarjeta,
  createPlanCupo,
  getAllPlanesCupo,
  updatePlanCupo,
  updatePlanCupoEstado,
} from "@packages/db";
import {
  PlansServiceError,
  ErrorCodes,
  formatDateToDD_MM_YYYY,
} from "@packages/common-http";

// Registrar plan principal (solo superAdmin)
export async function registrarPlanPrincipal(data: any) {
  // 1. Validar con Zod
  const parsed = registrarPlanPrincipalSchema.safeParse(data);
  if (!parsed.success) {
    throw new PlansServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const {
    personaId,
    nombre,
    correo,
    fechaInicio,
    costo,
    direccion,
    metodoPagoId,
    tarjetaId,
  } = parsed.data;

  // 2. Crear plan principal
  let nuevoPlan: any;
  try {
    nuevoPlan = await createPlanPrincipal(
      personaId,
      nombre,
      correo,
      fechaInicio,
      costo,
      direccion,
      metodoPagoId,
      tarjetaId
    );
  } catch (error) {
    throw new PlansServiceError(
      ErrorCodes.DB_ERROR,
      "Ocurrió un error al guardar el plan principal",
      error
    );
  }

  // 3. Retornar
  return {
    id: nuevoPlan.priid,
    nombre: nuevoPlan.prinombre,
    correo: nuevoPlan.pricorreo,
    fechaInicio: formatDateToDD_MM_YYYY(nuevoPlan.prifechainicio),
    costo: nuevoPlan.pricosto,
    proxPago: nuevoPlan.priproxpago,
    direccion: nuevoPlan.pridireccion,
    estado: nuevoPlan.priestado,
    personaId: nuevoPlan.priidpersona,
    metodoPagoId: nuevoPlan.priidmetpago,
    tarjetaId: nuevoPlan.priidtarjeta,
  };
}

// Obtener todos los planes principales (solo superAdmin)
export async function obtenerPlanesPrincipales() {
  let planes: any[] = [];
  try {
    planes = await getAllPlanesPrincipalesWithRelations();
  } catch (error) {
    throw new PlansServiceError(
      ErrorCodes.DB_ERROR,
      "No fue posible consultar los planes principales",
      error
    );
  }

  return planes.map((row) => ({
    id: row.planprincipal.priid,
    nombre: row.planprincipal.prinombre,
    correo: row.planprincipal.pricorreo,
    fechaInicio: formatDateToDD_MM_YYYY(row.planprincipal.prifechainicio),
    costo: row.planprincipal.pricosto,
    proxPago: formatDateToDD_MM_YYYY(row.planprincipal.priproxpago),
    direccion: row.planprincipal.pridireccion,
    estado: row.planprincipal.priestado,
    persona: {
      id: row.persona.perid,
      nombres: row.persona.pernombres,
      apellidos: row.persona.perapellidos,
      telefono: row.persona.pertelefono,
    },
    metodoPago: {
      id: row.metodopago.mtpid,
      nombre: row.metodopago.mtpnombre,
    },
    tarjeta: {
      id: row.tarjeta.tarid,
      numero: "**** **** **** " + row.tarjeta.tarnumero.slice(-4),
      banco: row.tarjeta.tarbanco,
    },
  }));
}

// Actualizar plan principal (solo superAdmin)
export async function actualizarPlanPrincipal(data: any) {
  // 1. Validar con Zod
  const parsed = actualizarPlanPrincipalSchema.safeParse(data);
  if (!parsed.success) {
    throw new PlansServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const { id, nombre, correo, costo, direccion } = parsed.data;

  // 2. Validar que al menos un campo sea proporcionado
  if (!nombre && !correo && !costo && !direccion) {
    throw new PlansServiceError(
      ErrorCodes.VALIDATION_ERROR,
      "Debe proporcionar al menos un campo para actualizar"
    );
  }

  // 3. Actualizar datos
  let planActualizado: any;
  try {
    planActualizado = await updatePlanPrincipalDatos(
      id,
      nombre || "",
      correo || "",
      costo || 0,
      direccion || ""
    );
  } catch (error) {
    throw new PlansServiceError(
      ErrorCodes.DB_ERROR,
      "Ocurrió un error al actualizar el plan principal",
      error
    );
  }

  // 4. Retornar
  return {
    id: planActualizado.priid,
    nombre: planActualizado.prinombre,
    correo: planActualizado.pricorreo,
    costo: planActualizado.pricosto,
    direccion: planActualizado.pridireccion,
  };
}

// Cambiar estado de plan principal (solo superAdmin)
export async function cambiarEstadoPlanPrincipal(data: any) {
  // 1. Validar con Zod
  const parsed = cambiarEstadoPlanPrincipalSchema.safeParse(data);
  if (!parsed.success) {
    throw new PlansServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const { id, estado } = parsed.data;

  // 2. Cambiar estado
  let planActualizado: any;
  try {
    planActualizado = await updatePlanPrincipalEstado(id, estado);
  } catch (error) {
    throw new PlansServiceError(
      ErrorCodes.DB_ERROR,
      "Ocurrió un error al cambiar el estado del plan",
      error
    );
  }

  // 3. Retornar
  return {
    id: planActualizado.priid,
    estado: planActualizado.priestado,
  };
}

// Cambiar método de pago de plan principal (solo superAdmin)
export async function cambiarMetodoPagoPlan(data: any) {
  // 1. Validar con Zod
  const parsed = cambiarMetodoPagoPlanSchema.safeParse(data);
  if (!parsed.success) {
    throw new PlansServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const { id, metodoPagoId } = parsed.data;

  // 2. Cambiar método de pago
  let planActualizado: any;
  try {
    planActualizado = await updatePlanPrincipalMetodoPago(id, metodoPagoId);
  } catch (error) {
    throw new PlansServiceError(
      ErrorCodes.DB_ERROR,
      "Ocurrió un error al cambiar el método de pago",
      error
    );
  }

  // 3. Retornar
  return {
    id: planActualizado.priid,
    metodoPagoId: planActualizado.priidmetpago,
  };
}

// Cambiar tarjeta de plan principal (solo superAdmin)
export async function cambiarTarjetaPlan(data: any) {
  // 1. Validar con Zod
  const parsed = cambiarTarjetaPlanSchema.safeParse(data);
  if (!parsed.success) {
    throw new PlansServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const { id, tarjetaId } = parsed.data;

  // 2. Cambiar tarjeta
  let planActualizado: any;
  try {
    planActualizado = await updatePlanPrincipalTarjeta(id, tarjetaId);
  } catch (error) {
    throw new PlansServiceError(
      ErrorCodes.DB_ERROR,
      "Ocurrió un error al cambiar la tarjeta",
      error
    );
  }

  // 3. Retornar
  return {
    id: planActualizado.priid,
    tarjetaId: planActualizado.priidtarjeta,
  };
}

// Registrar plan cupo (solo superAdmin)
export async function registrarPlanCupo(data: any) {
  // 1. Validar con Zod
  const parsed = registrarPlanCupoSchema.safeParse(data);
  if (!parsed.success) {
    throw new PlansServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const { nombre, duracionMeses, promocion, precio } = parsed.data;

  // 2. Crear plan cupo
  let nuevoPlanCupo: any;
  try {
    nuevoPlanCupo = await createPlanCupo(
      nombre,
      duracionMeses,
      promocion,
      precio
    );
  } catch (error) {
    throw new PlansServiceError(
      ErrorCodes.DB_ERROR,
      "Ocurrió un error al guardar el plan cupo",
      error
    );
  }

  // 3. Retornar
  return {
    id: nuevoPlanCupo.cupid,
    nombre: nuevoPlanCupo.cupnombre,
    duracionMeses: nuevoPlanCupo.cupduracionmeses,
    promocion: nuevoPlanCupo.cuppromocion,
    precio: nuevoPlanCupo.cupprecio,
    estado: nuevoPlanCupo.cupestado,
  };
}

// Obtener todos los planes cupo (solo superAdmin)
export async function obtenerPlanesCupo() {
  let planesCupo: any[] = [];
  try {
    planesCupo = await getAllPlanesCupo();
  } catch (error) {
    throw new PlansServiceError(
      ErrorCodes.DB_ERROR,
      "No fue posible consultar los planes cupo",
      error
    );
  }

  return planesCupo.map((plan) => ({
    id: plan.cupid,
    nombre: plan.cupnombre,
    duracionMeses: plan.cupduracionmeses,
    promocion: plan.cuppromocion,
    precio: plan.cupprecio,
    estado: plan.cupestado,
  }));
}

// Actualizar plan cupo (solo superAdmin)
export async function actualizarPlanCupo(data: any) {
  // 1. Validar con Zod
  const parsed = actualizarPlanCupoSchema.safeParse(data);
  if (!parsed.success) {
    throw new PlansServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const { id, nombre, duracionMeses, promocion, precio } = parsed.data;

  // 2. Validar que al menos un campo sea proporcionado
  if (!nombre && !duracionMeses && promocion === undefined && !precio) {
    throw new PlansServiceError(
      ErrorCodes.VALIDATION_ERROR,
      "Debe proporcionar al menos un campo para actualizar"
    );
  }

  // 3. Actualizar plan cupo
  let planCupoActualizado: any;
  try {
    planCupoActualizado = await updatePlanCupo(
      id,
      nombre || "",
      duracionMeses || 0,
      promocion ?? false,
      precio || 0
    );
  } catch (error) {
    throw new PlansServiceError(
      ErrorCodes.DB_ERROR,
      "Ocurrió un error al actualizar el plan cupo",
      error
    );
  }

  // 4. Retornar
  return {
    id: planCupoActualizado.cupid,
    nombre: planCupoActualizado.cupnombre,
    duracionMeses: planCupoActualizado.cupduracionmeses,
    promocion: planCupoActualizado.cuppromocion,
    precio: planCupoActualizado.cupprecio,
  };
}

// Cambiar estado de plan cupo (solo superAdmin)
export async function cambiarEstadoPlanCupo(data: any) {
  // 1. Validar con Zod
  const parsed = cambiarEstadoPlanCupoSchema.safeParse(data);
  if (!parsed.success) {
    throw new PlansServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const { id, estado } = parsed.data;

  // 2. Cambiar estado
  let planCupoActualizado: any;
  try {
    planCupoActualizado = await updatePlanCupoEstado(id, estado);
  } catch (error) {
    throw new PlansServiceError(
      ErrorCodes.DB_ERROR,
      "Ocurrió un error al cambiar el estado del plan cupo",
      error
    );
  }

  // 3. Retornar
  return {
    id: planCupoActualizado.cupid,
    estado: planCupoActualizado.cupestado,
  };
}
