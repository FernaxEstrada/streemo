import { z } from "zod";

export const registrarPersonaSchema = z.object({
  nombres: z
    .string({ required_error: "El nombre es obligatorio" })
    .max(100, { message: "Longitud máxima de 100 caracteres" }),
  apellidos: z
    .string({ required_error: "El apellido es obligatorio" })
    .max(100, { message: "Longitud máxima de 100 caracteres" }),
  telefono: z
    .string({ required_error: "El teléfono es obligatorio" })
    .max(15, { message: "Longitud máxima de 15 caracteres" }),
  sexo: z.enum(["M", "F"], {
    required_error: "El sexo es obligatorio",
    message: "El sexo debe ser 'M' o 'F'",
  }),
  tipoap: z.boolean({ required_error: "El tipo admin de plan es obligatorio" }),
  tipoc: z.boolean({ required_error: "El tipo cliente es obligatorio" }),
  tiposa: z.boolean({ required_error: "El tipo super admin es obligatorio" }),
});

export const actualizarDatosPersonaSchema = z.object({
  idPersona: z
    .string({ required_error: "El ID de persona es obligatorio" })
    .uuid({ message: "El ID de persona no es válido" }),
  nombres: z
    .string({ required_error: "El nombre es obligatorio" })
    .max(100, { message: "Longitud máxima de 100 caracteres" }),
  apellidos: z
    .string({ required_error: "El apellido es obligatorio" })
    .max(100, { message: "Longitud máxima de 100 caracteres" }),
  telefono: z
    .string({ required_error: "El teléfono es obligatorio" })
    .max(15, { message: "Longitud máxima de 15 caracteres" }),
  sexo: z.enum(["M", "F"], {
    required_error: "El sexo es obligatorio",
    message: "El sexo debe ser 'M' o 'F'",
  }),
});

export const actualizarRolesPersonaSchema = z.object({
  idPersona: z
    .string({ required_error: "El ID de persona es obligatorio" })
    .uuid({ message: "El ID de persona no es válido" }),
  tipoap: z.boolean({ required_error: "El tipo admin de plan es obligatorio" }),
  tipoc: z.boolean({ required_error: "El tipo cliente es obligatorio" }),
  tiposa: z.boolean({ required_error: "El tipo super admin es obligatorio" }),
});

export const cambiarEstadoPersonaSchema = z.object({
  idPersona: z
    .string({ required_error: "El ID de persona es obligatorio" })
    .uuid({ message: "El ID de persona no es válido" }),
  estado: z.boolean({
    required_error: "El estado es obligatorio",
    invalid_type_error: "El estado debe ser verdadero o falso",
  }),
});
