import { Persona } from "./persona";

export type Usuario = {
  idpersona: string;
  usuario: string;
  estadousuario: boolean;
};

export type UsuarioRaw = Usuario & Persona;