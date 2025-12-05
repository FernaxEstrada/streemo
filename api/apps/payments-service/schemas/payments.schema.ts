import * as z from "zod";

// Registrar método de pago (solo superAdmin)
export const registrarMetodoPagoSchema = z.object({
  nombre: z
    .string({ message: "Nombre requerido" })
    .min(1, { message: "Nombre requerido" })
    .max(100, { message: "Nombre muy largo" }),
});

// Obtener métodos de pago (solo superAdmin)
export const obtenerMetodosPagoSchema = z.object({});

// Actualizar método de pago (solo superAdmin)
export const actualizarMetodoPagoSchema = z.object({
  id: z.uuid({ message: "ID de método de pago inválido" }),
  nombre: z
    .string({ message: "Nombre requerido" })
    .min(1, { message: "Nombre requerido" })
    .max(100, { message: "Nombre muy largo" })
    .optional(),
  estado: z.boolean().optional(),
});

// Registrar tarjeta (solo superAdmin)
export const registrarTarjetaSchema = z.object({
  personaId: z.uuid({ message: "ID de persona inválido" }),
  numero: z
    .string({ message: "Número de tarjeta requerido" })
    .min(13, { message: "El número de tarjeta debe tener al menos 13 dígitos" })
    .max(19, { message: "El número de tarjeta no puede exceder 19 dígitos" }),
  banco: z
    .string({ message: "Banco requerido" })
    .min(1, { message: "Banco requerido" })
    .max(50, { message: "Banco muy largo" }),
  vencimiento: z
    .string({ message: "Vencimiento requerido" })
    .regex(/^\d{2}\/\d{2}$/, {
      message: "El vencimiento debe estar en formato MM/YY",
    }),
});

// Obtener tarjetas (solo superAdmin)
export const obtenerTarjetasSchema = z.object({});

// Actualizar estado de tarjeta (solo superAdmin)
export const actualizarEstadoTarjetaSchema = z.object({
  id: z.uuid({ message: "ID de tarjeta inválido" }),
  estado: z.boolean({ message: "Estado requerido" }),
});
