import { z } from "zod";

export const registrarUsuarioSchema = z.object({
  idPersona: z
    .string({ required_error: "El ID de persona es obligatorio" })
    .uuid({ message: "El ID de persona no es válido" }),
  usuario: z
    .string({ required_error: "El usuario es obligatorio" })
    .min(3, { message: "El usuario debe tener al menos 3 caracteres" })
    .max(100, { message: "Longitud máxima de 100 caracteres" }),
  contrasena: z
    .string({ required_error: "La contraseña es obligatoria" })
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    .max(60, { message: "Longitud máxima de 60 caracteres" }),
});

export const actualizarNombreUsuarioSchema = z.object({
  idPersona: z
    .string({ required_error: "El ID de persona es obligatorio" })
    .uuid({ message: "El ID de persona no es válido" }),
  nuevoUsuario: z
    .string({ required_error: "El usuario es obligatorio" })
    .min(3, { message: "El usuario debe tener al menos 3 caracteres" })
    .max(100, { message: "Longitud máxima de 100 caracteres" }),
});

export const actualizarContrasenaUsuarioSchema = z.object({
  idPersona: z
    .string({ required_error: "El ID de persona es obligatorio" })
    .uuid({ message: "El ID de persona no es válido" }),
  nuevaContrasena: z
    .string({ required_error: "La contraseña es obligatoria" })
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    .max(60, { message: "Longitud máxima de 60 caracteres" }),
});

export const cambiarEstadoUsuarioSchema = z.object({
  idPersona: z
    .string({ required_error: "El ID de persona es obligatorio" })
    .uuid({ message: "El ID de persona no es válido" }),
  estado: z.boolean({
    required_error: "El estado es obligatorio",
    invalid_type_error: "El estado debe ser verdadero o falso",
  }),
});

export const iniciarSesionUsuarioSchema = z.object({
  usuario: z
    .string({ required_error: "El usuario es obligatorio" })
    .min(3, { message: "El usuario debe tener al menos 3 caracteres" })
    .max(100, { message: "Longitud máxima de 100 caracteres" }),
  contrasena: z
    .string({ required_error: "La contraseña es obligatoria" })
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    .max(60, { message: "Longitud máxima de 60 caracteres" }),
});
