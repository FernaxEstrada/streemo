import { PagoPlanRaw } from "../../types/pago-plan";

export function mapPagoPlan(row: PagoPlanRaw) {
  return {
    idpagoplan: row.idpagoplan,
    fechafacturacion: row.fechafacturacion,
    fechapago: row.fechapago,
    monto: row.monto,
    metodopago: row.metodopago,
    tarjeta: row.tarjeta,
    nota: row.nota,
    estado: row.estadopagoplan,
    planprincipal: {
      idplanp: row.idplanp,
      nombreplan: row.nombreplan,
      correo: row.correo,
      fechainicio: row.fechainicio,
      costo: row.costo,
      proxpago: row.proxpago,
      direccionplan: row.direccionplan,
      estado: row.estadoplanp,
      persona: {
        idpersona: row.idpersona,
        nombres: row.nombres,
        apellidos: row.apellidos,
        telefono: row.telefono,
        sexo: row.sexo,
        tipoap: row.tipoap,
        tipoc: row.tipoc,
        tiposa: row.tiposa,
        estado: row.estadopersona,
      },
      metodopago: {
        idmetpago: row.idmetpago,
        nombre: row.nombre,
        estado: row.estadometpago,
      },
      tarjeta: {
        idtarjeta: row.idtarjeta,
        numero: row.numero,
        banco: row.banco,
        vencimiento: row.vencimiento,
        estado: row.estadotarjeta,
      },
    },
  };
}
