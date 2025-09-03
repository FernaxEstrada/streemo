import { z } from "zod";

export const insertarCupoVendidoSchema = z.object({
  idPersona: z
    .string({ required_error: "La ID de persona es obligatorio" })
    .uuid({ message: "El ID debe ser un UUID válido" }),
  idPlanP: z
    .string({ required_error: "El plan principal es obligatorio" })
    .uuid({ message: "El ID debe ser un UUID válido" }),
  idPlanCupo: z
    .string({ required_error: "El plan de cupo es obligatorio" })
    .uuid({ message: "El ID debe ser un UUID válido" }),
  idMetPago: z
    .string({ required_error: "El método de pago es obligatorio" })
    .uuid({ message: "El ID debe ser un UUID válido" }),
  usuario: z
    .string({ required_error: "El usuario es obligatorio" })
    .max(100, { message: "Longitud máxima de 100 caracteres" }),
  fechaInicio: z.coerce
    .string({ required_error: "La fecha de inicio es obligatoria" })
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, {
      message: "Formato de fecha inválido (DD/MM/YYYY)",
    }),
  nota: z.string().max(200, "Máximo 200 caracteres").optional(),
});

export const actualizarDatosCupoVendidoSchema = z.object({
  idCupo: z
    .string({ required_error: "El ID del cupo es obligatorio" })
    .uuid({ message: "El ID debe ser un UUID válido" }),
  usuario: z
    .string({ required_error: "El usuario es obligatorio" })
    .max(100, { message: "Longitud máxima de 100 caracteres" }),
  nota: z.string().max(200, "Máximo 200 caracteres").optional(),
});

export const cambiarPlanCupoVendidoSchema = z.object({
  idCupo: z
    .string({ required_error: "El ID del cupo es obligatorio" })
    .uuid({ message: "El ID debe ser un UUID válido" }),
  idPlanCupo: z
    .string({ required_error: "El ID del plan es obligatorio" })
    .uuid({ message: "El ID debe ser un UUID válido" }),
});

export const cambiarMetodoPagoCupoVendidoSchema = z.object({
  idCupo: z
    .string({ required_error: "El ID del cupo es obligatorio" })
    .uuid({ message: "El ID debe ser un UUID válido" }),
  idMetPago: z
    .string({ required_error: "El ID del metodo de pago es obligatorio" })
    .uuid({ message: "El ID debe ser un UUID válido" }),
});

export const cambiarEstadoCupoVendidoSchema = z.object({
  idCupo: z
    .string({ required_error: "El ID del cupo es obligatorio" })
    .uuid({ message: "El ID debe ser un UUID válido" }),
  estado: z.boolean({ required_error: "El estado es obligatorio" }),
});
