import * as z from "zod";

// Registrar pago de plan principal (solo superAdmin)
export const registrarPagoPlanPSchema = z.object({
  planPrincipalId: z.uuid({ message: "ID de plan principal inválido" }),
  fechaPago: z
    .string({ message: "Fecha de pago requerida" })
    .regex(/^\d{2}[-\/]\d{2}[-\/]\d{4}$/, {
      message: "La fecha debe estar en formato DD-MM-YYYY o DD/MM/YYYY",
    })
    .transform((fecha) => {
      const [dia, mes, año] = fecha.split(/[-\/]/);
      return `${año}-${mes}-${dia}`;
    }),
  nota: z
    .string({ message: "Nota requerida" })
    .max(200, { message: "Nota muy larga" })
    .optional(),
});

// Obtener pagos de planes principales (solo superAdmin)
export const obtenerPagosPlanPSchema = z.object({});

// Cambiar estado de pago de plan principal (solo superAdmin)
export const cambiarEstadoPagoPlanPSchema = z.object({
  id: z.uuid({ message: "ID de pago inválido" }),
  estado: z.boolean({ message: "Estado requerido" }),
});

// Actualizar nota de pago de plan principal (solo superAdmin)
export const actualizarNotaPagoPlanPSchema = z.object({
  id: z.uuid({ message: "ID de pago inválido" }),
  nota: z
    .string({ message: "Nota requerida" })
    .max(200, { message: "Nota muy larga" }),
});

// Registrar pago de cupo (solo superAdmin)
export const registrarPagoCupoSchema = z.object({
  cupoVendidoId: z.uuid({ message: "ID de cupo vendido inválido" }),
  fechaPago: z
    .string({ message: "Fecha de pago requerida" })
    .regex(/^\d{2}[-\/]\d{2}[-\/]\d{4}$/, {
      message: "La fecha debe estar en formato DD-MM-YYYY o DD/MM/YYYY",
    })
    .transform((fecha) => {
      const [dia, mes, año] = fecha.split(/[-\/]/);
      return `${año}-${mes}-${dia}`;
    }),
  nota: z
    .string({ message: "Nota requerida" })
    .max(200, { message: "Nota muy larga" })
    .optional(),
});

// Obtener pagos de cupos (solo superAdmin)
export const obtenerPagosCupoSchema = z.object({});

// Cambiar estado de pago de cupo (solo superAdmin)
export const cambiarEstadoPagoCupoSchema = z.object({
  id: z.uuid({ message: "ID de pago inválido" }),
  estado: z.boolean({ message: "Estado requerido" }),
});

// Actualizar nota de pago de cupo (solo superAdmin)
export const actualizarNotaPagoCupoSchema = z.object({
  id: z.uuid({ message: "ID de pago inválido" }),
  nota: z
    .string({ message: "Nota requerida" })
    .max(200, { message: "Nota muy larga" }),
});
