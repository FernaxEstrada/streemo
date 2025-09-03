import { z } from "zod";

export const insertarPlanCupoSchema = z.object({
  tipoPlan: z
    .string({ required_error: "El tipo de plan es obligatorio" })
    .min(2, "Debe tener al menos 2 caracteres")
    .max(50, "Máximo 50 caracteres"),
  duracionMes: z
    .number({ required_error: "La duración en meses es obligatoria" })
    .int("Debe ser un número entero")
    .min(1, "Debe durar al menos 1 mes"),
  promo: z.boolean({ required_error: "Debes indicar si es una promo o no" }),
  precio: z
    .number({ required_error: "El precio es obligatorio" })
    .positive("El precio debe ser positivo"),
});

export const actualizarPlanCupoSchema = z.object({
  idPlanCupo: z
    .string({ required_error: "El ID del plan de cupo es obligatorio" })
    .uuid({ message: "ID inválido" }),
  tipoPlan: z
    .string({ required_error: "El tipo de plan es obligatorio" })
    .min(2, "Debe tener al menos 2 caracteres")
    .max(50, "Máximo 50 caracteres"),
  duracionMes: z
    .number({ required_error: "La duración en meses es obligatoria" })
    .int("Debe ser un número entero")
    .min(1, "Debe durar al menos 1 mes"),
  promo: z.boolean({ required_error: "Debes indicar si es una promo o no" }),
  precio: z
    .number({ required_error: "El precio es obligatorio" })
    .positive("El precio debe ser positivo"),
});

export const cambiarEstadoPlanCupoSchema = z.object({
  idPlanCupo: z
    .string({ required_error: "El ID del plan de cupo es obligatorio" })
    .uuid({ message: "ID inválido" }),
  estado: z.boolean({ required_error: "El estado es obligatorio" }),
});
