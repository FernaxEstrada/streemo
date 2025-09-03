import { TarjetaRaw } from "../../types/tarjeta";

export function mapTarjeta(row: TarjetaRaw) {
  return {
    idtarjeta: row.idtarjeta,
    numero: row.numero,
    banco: row.banco,
    vencimiento: row.vencimiento,
    estado: row.estadotarjeta,
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
  };
}
