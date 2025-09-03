import { z } from "zod";

export const crearMetodoPagoSchema = z.object({
  nombre: z
    .string({ required_error: "El nombre es obligatorio" })
    .max(100, { message: "Longitud máxima de 100 caracteres" }),
});

export const actualizarNombreMetodoPagoSchema = z.object({
  idMetPago: z
    .string({ required_error: "El ID es obligatorio" })
    .uuid({ message: "El ID debe ser un UUID válido" }),
  nombre: z
    .string({ required_error: "El nombre es obligatorio" })
    .max(100, { message: "Longitud máxima de 100 caracteres" }),
});

export const cambiarEstadoMetodoPagoSchema = z.object({
  idMetPago: z
    .string({ required_error: "El ID es obligatorio" })
    .uuid({ message: "El ID debe ser un UUID válido" }),
  estado: z.boolean({ required_error: "El estado es obligatorio" }),
});
