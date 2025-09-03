import { z } from "zod";

export const registrarPlanSchema = z.object({
  idPersona: z
    .string({ required_error: "El ID de persona es obligatorio" })
    .uuid({ message: "ID de persona no válido" }),
  nombrePlan: z
    .string({ required_error: "El nombre del plan es obligatorio" })
    .max(100, { message: "Máximo 100 caracteres" }),
  correo: z
    .string({ required_error: "El correo es obligatorio" })
    .email({ message: "Correo no válido" })
    .max(100, { message: "Máximo 100 caracteres" }),
  fechaInicio: z
    .string({ required_error: "La fecha de inicio es obligatoria" })
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, {
      message: "Formato de fecha inválido (DD/MM/YYYY)",
    }),
  costo: z
    .number({ required_error: "El costo es obligatorio" })
    .nonnegative({ message: "El costo no puede ser negativo" }),
  direccionPlan: z
    .string({ required_error: "La dirección del plan es obligatoria" })
    .max(200, { message: "Máximo 200 caracteres" }),
  idMetPago: z
    .string({ required_error: "Método de pago requerido" })
    .uuid({ message: "ID de método de pago no válido" }),
  idTarjeta: z
    .string({ required_error: "La tarjeta es requerida" })
    .uuid({ message: "ID de tarjeta no válido" }),
});

export const actualizarDatosBasicosPlanSchema = z.object({
  idPlanP: z
    .string({ required_error: "El ID del plan es obligatorio" })
    .uuid({ message: "ID no válido" }),
  nombrePlan: z
    .string({ required_error: "El nombre del plan es obligatorio" })
    .max(100, { message: "Máximo 100 caracteres" }),
  correo: z
    .string({ required_error: "El correo es obligatorio" })
    .email({ message: "Correo no válido" })
    .max(100, { message: "Máximo 100 caracteres" }),
  costo: z
    .number({ required_error: "El costo es obligatorio" })
    .nonnegative({ message: "El costo no puede ser negativo" }),
  direccionPlan: z
    .string({ required_error: "La dirección del plan es obligatoria" })
    .max(200, { message: "Máximo 200 caracteres" }),
});

export const cambiarMetodoPagoPlanSchema = z.object({
  idPlanP: z
    .string({ required_error: "El ID del plan es obligatorio" })
    .uuid({ message: "ID no válido" }),
  idMetPago: z
    .string({ required_error: "El ID del método de pago es obligatorio" })
    .uuid({ message: "ID de método de pago no válido" }),
});

export const cambiarTarjetaPlanSchema = z.object({
  idPlanP: z
    .string({ required_error: "El ID del plan es obligatorio" })
    .uuid({ message: "ID no válido" }),
  idTarjeta: z
    .string({ required_error: "El ID de tarjeta es obligatorio" })
    .uuid({ message: "ID de tarjeta no válido" }),
});

export const cambiarEstadoPlanSchema = z.object({
  idPlanP: z
    .string({ required_error: "El ID del plan es obligatorio" })
    .uuid({ message: "El ID debe ser un UUID válido" }),
  estado: z.boolean({ required_error: "El estado es obligatorio" }),
});
