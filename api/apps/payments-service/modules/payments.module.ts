import {
  registrarMetodoPagoSchema,
  actualizarMetodoPagoSchema,
  registrarTarjetaSchema,
  actualizarEstadoTarjetaSchema,
} from "../schemas/payments.schema";
import {
  createMetodoPago,
  getAllMetodosPago,
  updateMetodoPago,
  updateMetodoPagoEstado,
  createTarjeta,
  getAllTarjetasWithPersona,
  updateTarjetaEstado,
} from "@packages/db";
import { PaymentsServiceError, ErrorCodes } from "@packages/common-http";

// Registrar método de pago (solo superAdmin)
export async function registrarMetodoPago(data: any) {
  // 1. Validar con Zod
  const parsed = registrarMetodoPagoSchema.safeParse(data);
  if (!parsed.success) {
    throw new PaymentsServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const { nombre } = parsed.data;

  // 2. Crear método de pago
  let nuevoMetodo: any;
  try {
    nuevoMetodo = await createMetodoPago(nombre);
  } catch (error) {
    throw new PaymentsServiceError(
      ErrorCodes.DB_ERROR,
      "Ocurrió un error al guardar el método de pago",
      error
    );
  }

  // 3. Retornar
  return {
    id: nuevoMetodo.mtpid,
    nombre: nuevoMetodo.mtpnombre,
    estado: nuevoMetodo.mtpestado,
  };
}

// Obtener todos los métodos de pago (solo superAdmin)
export async function obtenerMetodosPago() {
  let metodos: any[] = [];
  try {
    metodos = await getAllMetodosPago();
  } catch (error) {
    throw new PaymentsServiceError(
      ErrorCodes.DB_ERROR,
      "No fue posible consultar los métodos de pago",
      error
    );
  }

  return metodos.map((m) => ({
    id: m.mtpid,
    nombre: m.mtpnombre,
    estado: m.mtpestado,
  }));
}

// Actualizar método de pago (solo superAdmin)
export async function actualizarMetodoPago(data: any) {
  // 1. Validar con Zod
  const parsed = actualizarMetodoPagoSchema.safeParse(data);
  if (!parsed.success) {
    throw new PaymentsServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const { id, nombre, estado } = parsed.data;

  let metodoActualizado: any = null;

  // 2. Actualizar nombre si se proporciona
  if (nombre) {
    try {
      metodoActualizado = await updateMetodoPago(id, nombre);
    } catch (error) {
      throw new PaymentsServiceError(
        ErrorCodes.DB_ERROR,
        "Ocurrió un error al actualizar el nombre del método de pago",
        error
      );
    }
  }

  // 3. Cambiar estado si se proporciona
  if (estado !== undefined) {
    try {
      metodoActualizado = await updateMetodoPagoEstado(id, estado);
    } catch (error) {
      throw new PaymentsServiceError(
        ErrorCodes.DB_ERROR,
        "Ocurrió un error al cambiar el estado del método de pago",
        error
      );
    }
  }

  // 4. Si no se actualizó nada, lanzar error
  if (!metodoActualizado) {
    throw new PaymentsServiceError(
      ErrorCodes.VALIDATION_ERROR,
      "Debe proporcionar al menos un campo para actualizar"
    );
  }

  // 5. Retornar
  return {
    id: metodoActualizado.mtpid,
    nombre: metodoActualizado.mtpnombre,
    estado: metodoActualizado.mtpestado,
  };
}

// Registrar tarjeta (solo superAdmin)
export async function registrarTarjeta(data: any) {
  // 1. Validar con Zod
  const parsed = registrarTarjetaSchema.safeParse(data);
  if (!parsed.success) {
    throw new PaymentsServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const { personaId, numero, banco, vencimiento } = parsed.data;

  // 2. Crear tarjeta
  let nuevaTarjeta: any;
  try {
    nuevaTarjeta = await createTarjeta(personaId, numero, banco, vencimiento);
  } catch (error) {
    throw new PaymentsServiceError(
      ErrorCodes.DB_ERROR,
      "Ocurrió un error al guardar la tarjeta",
      error
    );
  }

  // 3. Retornar
  return {
    id: nuevaTarjeta.tarid,
    personaId: nuevaTarjeta.taridpersona,
    numero: nuevaTarjeta.tarnumero,
    banco: nuevaTarjeta.tarbanco,
    vencimiento: nuevaTarjeta.tarvencimiento,
    estado: nuevaTarjeta.tarestado,
  };
}

// Obtener todas las tarjetas (solo superAdmin)
export async function obtenerTarjetas() {
  let tarjetas: any[] = [];
  try {
    tarjetas = await getAllTarjetasWithPersona();
  } catch (error) {
    throw new PaymentsServiceError(
      ErrorCodes.DB_ERROR,
      "No fue posible consultar las tarjetas",
      error
    );
  }

  return tarjetas.map((row) => ({
    id: row.tarjeta.tarid,
    personaId: row.tarjeta.taridpersona,
    numero: row.tarjeta.tarnumero,
    banco: row.tarjeta.tarbanco,
    vencimiento: row.tarjeta.tarvencimiento,
    estado: row.tarjeta.tarestado,
    persona: {
      nombres: row.persona.pernombres,
      apellidos: row.persona.perapellidos,
      telefono: row.persona.pertelefono,
    },
  }));
}

// Actualizar estado de tarjeta (solo superAdmin)
export async function actualizarEstadoTarjeta(data: any) {
  // 1. Validar con Zod
  const parsed = actualizarEstadoTarjetaSchema.safeParse(data);
  if (!parsed.success) {
    throw new PaymentsServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const { id, estado } = parsed.data;

  // 2. Cambiar estado
  let tarjetaActualizada: any;
  try {
    tarjetaActualizada = await updateTarjetaEstado(id, estado);
  } catch (error) {
    throw new PaymentsServiceError(
      ErrorCodes.DB_ERROR,
      "Ocurrió un error al cambiar el estado de la tarjeta",
      error
    );
  }

  // 3. Retornar
  return {
    id: tarjetaActualizada.tarid,
    personaId: tarjetaActualizada.taridpersona,
    numero: tarjetaActualizada.tarnumero,
    banco: tarjetaActualizada.tarbanco,
    vencimiento: tarjetaActualizada.tarvencimiento,
    estado: tarjetaActualizada.tarestado,
  };
}
