import * as z from "zod";

// Login: usuario y contraseña
export const loginSchema = z.object({
  usuario: z
    .string({ message: "Usuario requerido" })
    .min(1, { message: "Usuario requerido" })
    .max(100, { message: "Usuario muy largo" }),
  contrasena: z
    .string({ message: "Contraseña requerida" })
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

// Registrar persona (solo superAdmin)
export const registrarPersonaSchema = z.object({
  nombres: z
    .string({ message: "Nombres requeridos" })
    .min(1, { message: "Nombres requeridos" })
    .max(100, { message: "Nombres muy largo" }),
  apellidos: z
    .string({ message: "Apellidos requeridos" })
    .min(1, { message: "Apellidos requeridos" })
    .max(100, { message: "Apellidos muy largo" }),
  telefono: z
    .string({ message: "Teléfono requerido" })
    .refine((value) => /^\d+$/.test(value), {
      message: "El teléfono debe ser un número",
    })
    .length(8, { message: "El teléfono debe tener exactamente 8 dígitos" }),
  sexo: z.enum(["M", "F"], { message: "Sexo debe ser M o F" }),
  esSuperAdmin: z.boolean().optional().default(false),
  esAdminPlan: z.boolean().optional().default(false),
  esCliente: z.boolean().optional().default(true),
});

// Obtener personas (solo superAdmin)
export const obtenerPersonasSchema = z.object({});

// Actualizar persona (solo superAdmin)
export const actualizarPersonaSchema = z.object({
  id: z.uuid({ message: "ID de persona inválido" }),
  nombres: z
    .string({ message: "Nombres requeridos" })
    .min(1, { message: "Nombres requeridos" })
    .max(100, { message: "Nombres muy largo" })
    .optional(),
  apellidos: z
    .string({ message: "Apellidos requeridos" })
    .min(1, { message: "Apellidos requeridos" })
    .max(100, { message: "Apellidos muy largo" })
    .optional(),
  telefono: z
    .string({ message: "Teléfono requerido" })
    .refine((value) => /^\d+$/.test(value), {
      message: "El teléfono debe ser un número",
    })
    .length(8, { message: "El teléfono debe tener exactamente 8 dígitos" })
    .optional(),
  sexo: z.enum(["M", "F"], { message: "Sexo debe ser M o F" }).optional(),
  esSuperAdmin: z.boolean().optional(),
  esAdminPlan: z.boolean().optional(),
  esCliente: z.boolean().optional(),
  activo: z.boolean().optional(),
});

// Registrar usuario (solo superAdmin)
export const registrarUsuarioSchema = z.object({
  personaId: z.uuid({ message: "ID de persona inválido" }),
  usuario: z
    .string({ message: "Usuario requerido" })
    .min(1, { message: "Usuario requerido" })
    .max(100, { message: "Usuario muy largo" }),
  contrasena: z
    .string({ message: "Contraseña requerida" })
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

// Obtener usuarios (solo superAdmin)
export const obtenerUsuariosSchema = z.object({});

// Actualizar usuario (solo superAdmin) - nombre y estado
export const actualizarUsuarioSchema = z.object({
  personaId: z.uuid({ message: "ID de persona inválido" }),
  usuario: z
    .string({ message: "Usuario requerido" })
    .min(1, { message: "Usuario requerido" })
    .max(100, { message: "Usuario muy largo" })
    .optional(),
  activo: z.boolean().optional(),
});

// Actualizar contraseña de usuario (solo superAdmin)
export const actualizarPasswordUsuarioSchema = z.object({
  personaId: z.uuid({ message: "ID de persona inválido" }),
  contrasena: z
    .string({ message: "Contraseña requerida" })
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});
