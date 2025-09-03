import { z } from "zod";

export const insertarPagoPlanSchema = z.object({
  idPlanP: z
    .string({ required_error: "El ID del plan es obligatorio" })
    .uuid({ message: "ID del plan inválido" }),
  fechaPago: z.coerce
    .string({ required_error: "La fecha de pago es obligatoria" })
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, {
      message: "Formato de fecha inválido (DD/MM/YYYY)",
    }),
  nota: z.string().max(200, "Máximo 200 caracteres").optional(),
});

export const actualizarNotaPagoPlanSchema = z.object({
  idPagoPlan: z
    .string({ required_error: "El ID del pago es obligatorio" })
    .uuid({ message: "ID del pago inválido" }),
  nota: z
    .string({ required_error: "La nota es obligatoria" })
    .max(200, "Máximo 200 caracteres"),
});

export const cambiarEstadoPagoPlanSchema = z.object({
  idPagoPlan: z
    .string({ required_error: "El ID de pago es obligatorio" })
    .uuid({ message: "El ID no es válido" }),
  estado: z.boolean({
    required_error: "El estado es obligatorio",
    invalid_type_error: "El estado debe ser verdadero o falso",
  }),
});
