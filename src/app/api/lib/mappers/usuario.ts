import { UsuarioRaw } from "../../types/usuario";

export function mapUsuario(row: UsuarioRaw) {
  return {
    idpersona: row.idpersona,
    usuario: row.usuario,
    estado: row.estadousuario,
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
