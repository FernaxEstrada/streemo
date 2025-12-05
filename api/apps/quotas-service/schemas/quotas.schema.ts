import * as z from "zod";

// Registrar cupo vendido (solo superAdmin)
export const registrarCupoVendidoSchema = z.object({
  personaId: z.uuid({ message: "ID de persona inválido" }),
  planPrincipalId: z.uuid({ message: "ID de plan principal inválido" }),
  planCupoId: z.uuid({ message: "ID de plan cupo inválido" }),
  metodoPagoId: z.uuid({ message: "ID de método de pago inválido" }),
  usuario: z
    .string({ message: "Usuario requerido" })
    .min(1, { message: "Usuario requerido" })
    .max(100, { message: "Usuario muy largo" }),
  fechaInicio: z
    .string({ message: "Fecha de inicio requerida" })
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

// Obtener cupos vendidos (solo superAdmin)
export const obtenerCuposVendidosSchema = z.object({});

// Cambiar estado de cupo vendido (solo superAdmin)
export const cambiarEstadoCupoVendidoSchema = z.object({
  id: z.uuid({ message: "ID de cupo vendido inválido" }),
  estado: z.boolean({ message: "Estado requerido" }),
});

// Cambiar plan cupo de cupo vendido (solo superAdmin)
export const cambiarPlanCupoCupoVendidoSchema = z.object({
  id: z.uuid({ message: "ID de cupo vendido inválido" }),
  planCupoId: z.uuid({ message: "ID de plan cupo inválido" }),
});

// Cambiar método de pago de cupo vendido (solo superAdmin)
export const cambiarMetodoPagoCupoVendidoSchema = z.object({
  id: z.uuid({ message: "ID de cupo vendido inválido" }),
  metodoPagoId: z.uuid({ message: "ID de método de pago inválido" }),
});

// Actualizar datos de cupo vendido (solo superAdmin)
export const actualizarCupoVendidoSchema = z.object({
  id: z.uuid({ message: "ID de cupo vendido inválido" }),
  usuario: z
    .string({ message: "Usuario requerido" })
    .min(1, { message: "Usuario requerido" })
    .max(100, { message: "Usuario muy largo" })
    .optional(),
  nota: z
    .string({ message: "Nota requerida" })
    .max(200, { message: "Nota muy larga" })
    .optional(),
});
