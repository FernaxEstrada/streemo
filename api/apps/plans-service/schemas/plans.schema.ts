import * as z from "zod";

// Registrar plan principal (solo superAdmin)
export const registrarPlanPrincipalSchema = z.object({
  personaId: z.uuid({ message: "ID de persona inválido" }),
  nombre: z
    .string({ message: "Nombre requerido" })
    .min(1, { message: "Nombre requerido" })
    .max(100, { message: "Nombre muy largo" }),
  correo: z
    .string({ message: "Correo requerido" })
    .email({ message: "Correo inválido" })
    .max(100, { message: "Correo muy largo" }),
  fechaInicio: z
    .string({ message: "Fecha de inicio requerida" })
    .regex(/^\d{2}[-\/]\d{2}[-\/]\d{4}$/, {
      message: "La fecha debe estar en formato DD-MM-YYYY o DD/MM/YYYY",
    })
    .transform((fecha) => {
      const [dia, mes, año] = fecha.split(/[-\/]/);
      return `${año}-${mes}-${dia}`;
    }),
  costo: z
    .number({ message: "Costo requerido" })
    .positive({ message: "El costo debe ser mayor a 0" }),
  direccion: z
    .string({ message: "Dirección requerida" })
    .min(1, { message: "Dirección requerida" })
    .max(200, { message: "Dirección muy larga" }),
  metodoPagoId: z.uuid({ message: "ID de método de pago inválido" }),
  tarjetaId: z.uuid({ message: "ID de tarjeta inválido" }),
});

// Obtener planes principales (solo superAdmin)
export const obtenerPlanesPrincipalesSchema = z.object({});

// Actualizar plan principal (solo superAdmin)
export const actualizarPlanPrincipalSchema = z.object({
  id: z.uuid({ message: "ID de plan inválido" }),
  nombre: z
    .string({ message: "Nombre requerido" })
    .min(1, { message: "Nombre requerido" })
    .max(100, { message: "Nombre muy largo" })
    .optional(),
  correo: z
    .string({ message: "Correo requerido" })
    .email({ message: "Correo inválido" })
    .max(100, { message: "Correo muy largo" })
    .optional(),
  costo: z
    .number({ message: "Costo requerido" })
    .positive({ message: "El costo debe ser mayor a 0" })
    .optional(),
  direccion: z
    .string({ message: "Dirección requerida" })
    .min(1, { message: "Dirección requerida" })
    .max(200, { message: "Dirección muy larga" })
    .optional(),
});

// Cambiar estado de plan principal (solo superAdmin)
export const cambiarEstadoPlanPrincipalSchema = z.object({
  id: z.uuid({ message: "ID de plan inválido" }),
  estado: z.boolean({ message: "Estado requerido" }),
});

// Cambiar método de pago de plan principal (solo superAdmin)
export const cambiarMetodoPagoPlanSchema = z.object({
  id: z.uuid({ message: "ID de plan inválido" }),
  metodoPagoId: z.uuid({ message: "ID de método de pago inválido" }),
});

// Cambiar tarjeta de plan principal (solo superAdmin)
export const cambiarTarjetaPlanSchema = z.object({
  id: z.uuid({ message: "ID de plan inválido" }),
  tarjetaId: z.uuid({ message: "ID de tarjeta inválido" }),
});

// Registrar plan cupo (solo superAdmin)
export const registrarPlanCupoSchema = z.object({
  nombre: z
    .string({ message: "Nombre requerido" })
    .min(1, { message: "Nombre requerido" })
    .max(50, { message: "Nombre muy largo" }),
  duracionMeses: z
    .number({ message: "Duración en meses requerida" })
    .int({ message: "Debe ser un número entero" })
    .positive({ message: "La duración debe ser mayor a 0" }),
  promocion: z.boolean({ message: "Promoción requerida" }),
  precio: z
    .number({ message: "Precio requerido" })
    .positive({ message: "El precio debe ser mayor a 0" }),
});

// Obtener planes cupo (solo superAdmin)
export const obtenerPlanesCupoSchema = z.object({});

// Actualizar plan cupo (solo superAdmin)
export const actualizarPlanCupoSchema = z.object({
  id: z.uuid({ message: "ID de plan cupo inválido" }),
  nombre: z
    .string({ message: "Nombre requerido" })
    .min(1, { message: "Nombre requerido" })
    .max(50, { message: "Nombre muy largo" })
    .optional(),
  duracionMeses: z
    .number({ message: "Duración en meses requerida" })
    .int({ message: "Debe ser un número entero" })
    .positive({ message: "La duración debe ser mayor a 0" })
    .optional(),
  promocion: z.boolean().optional(),
  precio: z
    .number({ message: "Precio requerido" })
    .positive({ message: "El precio debe ser mayor a 0" })
    .optional(),
});

// Cambiar estado de plan cupo (solo superAdmin)
export const cambiarEstadoPlanCupoSchema = z.object({
  id: z.uuid({ message: "ID de plan cupo inválido" }),
  estado: z.boolean({ message: "Estado requerido" }),
});
