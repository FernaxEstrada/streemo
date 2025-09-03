import { PagoCupoRaw } from "../../types/pago-cupo";

export function mapPagoCupo(row: PagoCupoRaw) {
  return {
    idpagocupo: row.idpagocupo,
    fechafacturacion: row.fechafacturacion,
    fechapago: row.fechapago,
    mesespagados: row.mesespagados,
    monto: row.monto,
    metodopago: row.metodopago,
    nota: row.nota,
    estado: row.estadopagocupo,
    cupovendido: {
      idcupo: row.idcupo,
      usuario: row.usuario,
      fechainicio: row.fechainicio,
      proxpago: row.proxpago,
      nota: row.nota,
      estado: row.estadocupov,
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
      planprincipal: {
        idplanp: row.idplanp,
        nombreplan: row.nombreplan,
        correo: row.correo,
        fechainicio: row.fechainicio,
        costo: row.costo,
        proxpago: row.proxpago,
        direccionplan: row.direccionplan,
        estado: row.estadoplanp,
      },
      plancupo: {
        idplancupo: row.idplancupo,
        tipoplan: row.tipoplan,
        duracionmes: row.duracionmes,
        promo: row.promo,
        precio: row.precio,
        estado: row.estadoplancupo,
      },
      metodopago: {
        idmetpago: row.idmetpago,
        nombre: row.nombre,
        estado: row.estadometpago,
      },
    },
  };
}
