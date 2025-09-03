import { z } from "zod";

export const registrarTarjetaSchema = z.object({
  idPersona: z
    .string({ required_error: "El ID de persona es obligatorio" })
    .uuid({ message: "ID de persona no válido" }),
  numero: z
    .string({ required_error: "La tarjeta es obligatoria" })
    .regex(/^\d{13,19}$/, {
      message: "Debe contener entre 13 y 19 dígitos numéricos",
    }),
  banco: z
    .string({ required_error: "El banco es obligatorio" })
    .min(2, { message: "Longitud mínima de 2 caracteres" })
    .max(50, { message: "Longitud máxima de 50 caracteres" }),
  vencimiento: z
    .string({ required_error: "La fecha de vencimiento es obligatoria" })
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, {
      message: "Formato de vencimiento inválido (MM/YY)",
    }),
});

export const actualizarTarjetaSchema = z.object({
  idTarjeta: z
    .string({ required_error: "El ID de tarjeta es obligatorio" })
    .uuid({ message: "ID de tarjeta no válido" }),
  idPersona: z
    .string({ required_error: "El ID de persona es obligatorio" })
    .uuid({ message: "ID de persona no válido" }),
  numero: z
    .string({ required_error: "La tarjeta es obligatoria" })
    .regex(/^\d{13,19}$/, {
      message: "Debe contener entre 13 y 19 dígitos numéricos",
    }),
  banco: z
    .string({ required_error: "El banco es obligatorio" })
    .min(2, { message: "Longitud mínima de 2 caracteres" })
    .max(50, { message: "Longitud máxima de 50 caracteres" }),
  vencimiento: z
    .string({ required_error: "La fecha de vencimiento es obligatoria" })
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, {
      message: "Formato de vencimiento inválido (MM/YY)",
    }),
});

export const cambiarEstadoTarjetaSchema = z.object({
  idTarjeta: z
    .string({ required_error: "El ID tarjeta es obligatorio" })
    .uuid({ message: "El ID debe ser un UUID válido" }),
  estado: z.boolean({ required_error: "El estado es obligatorio" }),
});
