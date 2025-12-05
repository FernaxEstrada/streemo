import {
  loginSchema,
  registrarPersonaSchema,
  actualizarPersonaSchema,
  registrarUsuarioSchema,
  actualizarUsuarioSchema,
  actualizarPasswordUsuarioSchema,
} from "../schemas/auth.schema";
import {
  getUsuarioByUsername,
  createPersona,
  getAllPersonas,
  updatePersonaDatos,
  updatePersonaEstado,
  updatePersonaRoles,
  createUsuario,
  updateUsuarioContrasena,
  updateUsuarioNombre,
  updateUsuarioEstado,
  getAllUsuariosWithPersona,
} from "@packages/db";
import { verifyPassword, hashPassword } from "../utils/password";
import { signToken } from "@packages/jwt";
import {
  AuthServiceError,
  ErrorCodes,
  formatDateToDDMMYYYY,
} from "@packages/common-http";

// Login con usuario y contraseña
export async function iniciarSesion(data: any) {
  // 1. Validar con Zod
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    throw new AuthServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const { usuario: usuarioInput, contrasena } = parsed.data;

  // 2. Buscar usuario con datos de persona
  let result: any | null = null;
  try {
    result = await getUsuarioByUsername(usuarioInput);
  } catch (error) {
    throw new AuthServiceError(
      ErrorCodes.DB_ERROR,
      "No fue posible consultar el usuario",
      error
    );
  }

  // 3. Validar existencia
  if (!result) {
    throw new AuthServiceError(
      ErrorCodes.INVALID_CREDENTIALS,
      "El usuario o la contraseña son incorrectos"
    );
  }

  const usuario = result.usuario;
  const persona = result.persona;

  // 4. Validar contraseña
  const isValid = await verifyPassword(contrasena, usuario.usucontrasena);
  if (!isValid) {
    throw new AuthServiceError(
      ErrorCodes.INVALID_CREDENTIALS,
      "El usuario o la contraseña son incorrectos"
    );
  }

  // 5. Validar estado del usuario
  if (!usuario.usuactivo) {
    throw new AuthServiceError(
      ErrorCodes.USER_INACTIVE,
      "Tu cuenta ha sido desactivada. Contacta al administrador para más información"
    );
  }

  // 6. Validar estado de la persona
  if (!persona.perestado) {
    throw new AuthServiceError(
      ErrorCodes.USER_INACTIVE,
      "Tu perfil ha sido desactivado. Contacta al administrador para más información"
    );
  }

  // 7. Generar token
  const { token, exp } = signToken({
    sub: usuario.perid,
    esSuperAdmin: persona.pertiposa,
    esAdminPlan: persona.pertipoap,
    esCliente: persona.pertipoc,
  });

  // 8. Retornar
  return {
    usuario: {
      id: usuario.perid,
      nombre: persona.pernombres,
      apellido: persona.perapellidos,
      telefono: persona.pertelefono,
      esSuperAdmin: persona.pertiposa,
      esAdminPlan: persona.pertipoap,
      esCliente: persona.pertipoc,
      activo: usuario.usuactivo && persona.perestado,
    },
    accessToken: token,
    expiraEl: formatDateToDDMMYYYY(exp),
  };
}

// Registrar persona (solo superAdmin)
export async function registrarPersona(data: any) {
  // 1. Validar con Zod
  const parsed = registrarPersonaSchema.safeParse(data);
  if (!parsed.success) {
    throw new AuthServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const {
    nombres,
    apellidos,
    telefono,
    sexo,
    esSuperAdmin,
    esAdminPlan,
    esCliente,
  } = parsed.data;

  // 2. Crear persona
  let nuevaPersona: any;
  try {
    nuevaPersona = await createPersona(
      nombres,
      apellidos,
      telefono,
      sexo,
      esAdminPlan,
      esCliente,
      esSuperAdmin
    );
  } catch (error) {
    throw new AuthServiceError(
      ErrorCodes.DB_ERROR,
      "Ocurrió un error al guardar la persona. Intenta nuevamente",
      error
    );
  }

  // 3. Retornar
  return {
    id: nuevaPersona.perid,
    nombres: nuevaPersona.pernombres,
    apellidos: nuevaPersona.perapellidos,
    telefono: nuevaPersona.pertelefono,
    sexo: nuevaPersona.persexo,
    esSuperAdmin: nuevaPersona.pertiposa,
    esAdminPlan: nuevaPersona.pertipoap,
    esCliente: nuevaPersona.pertipoc,
    activo: nuevaPersona.perestado,
  };
}

// Obtener todas las personas (solo superAdmin)
export async function obtenerPersonas() {
  let personas: any[] = [];
  try {
    personas = await getAllPersonas();
  } catch (error) {
    throw new AuthServiceError(
      ErrorCodes.DB_ERROR,
      "No fue posible consultar las personas",
      error
    );
  }

  return personas.map((p) => ({
    id: p.perid,
    nombres: p.pernombres,
    apellidos: p.perapellidos,
    telefono: p.pertelefono,
    sexo: p.persexo,
    esSuperAdmin: p.pertiposa,
    esAdminPlan: p.pertipoap,
    esCliente: p.pertipoc,
    activo: p.perestado,
  }));
}

// Actualizar persona (solo superAdmin)
export async function actualizarPersona(data: any) {
  // 1. Validar con Zod
  const parsed = actualizarPersonaSchema.safeParse(data);
  if (!parsed.success) {
    throw new AuthServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const {
    id,
    nombres,
    apellidos,
    telefono,
    sexo,
    esSuperAdmin,
    esAdminPlan,
    esCliente,
    activo,
  } = parsed.data;

  let personaActualizada: any = null;

  // 2. Actualizar datos básicos si se proporcionan
  if (nombres || apellidos || telefono || sexo) {
    try {
      personaActualizada = await updatePersonaDatos(
        id,
        nombres || "",
        apellidos || "",
        telefono || "",
        sexo || ""
      );
    } catch (error) {
      throw new AuthServiceError(
        ErrorCodes.DB_ERROR,
        "Ocurrió un error al actualizar los datos de la persona",
        error
      );
    }
  }

  // 3. Actualizar roles si se proporcionan
  if (
    esSuperAdmin !== undefined ||
    esAdminPlan !== undefined ||
    esCliente !== undefined
  ) {
    try {
      personaActualizada = await updatePersonaRoles(
        id,
        esAdminPlan ?? false,
        esCliente ?? false,
        esSuperAdmin ?? false
      );
    } catch (error) {
      throw new AuthServiceError(
        ErrorCodes.DB_ERROR,
        "Ocurrió un error al actualizar los roles de la persona",
        error
      );
    }
  }

  // 4. Cambiar estado si se proporciona
  if (activo !== undefined) {
    try {
      personaActualizada = await updatePersonaEstado(id, activo);
    } catch (error) {
      throw new AuthServiceError(
        ErrorCodes.DB_ERROR,
        "Ocurrió un error al cambiar el estado de la persona",
        error
      );
    }
  }

  // 5. Si no se actualizó nada, obtener la persona actual
  if (!personaActualizada) {
    throw new AuthServiceError(
      ErrorCodes.VALIDATION_ERROR,
      "Debe proporcionar al menos un campo para actualizar"
    );
  }

  // 6. Retornar
  return {
    id: personaActualizada.perid,
    nombres: personaActualizada.pernombres,
    apellidos: personaActualizada.perapellidos,
    telefono: personaActualizada.pertelefono,
    sexo: personaActualizada.persexo,
    esSuperAdmin: personaActualizada.pertiposa,
    esAdminPlan: personaActualizada.pertipoap,
    esCliente: personaActualizada.pertipoc,
    activo: personaActualizada.perestado,
  };
}

// Registrar usuario (solo superAdmin)
export async function registrarUsuario(data: any) {
  // 1. Validar con Zod
  const parsed = registrarUsuarioSchema.safeParse(data);
  if (!parsed.success) {
    throw new AuthServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const { personaId, usuario, contrasena } = parsed.data;

  // 2. Hash de contraseña
  let contrasenaHash: string;
  try {
    contrasenaHash = await hashPassword(contrasena);
  } catch (error) {
    throw new AuthServiceError(
      ErrorCodes.PASSWORD_HASH_ERROR,
      "Ocurrió un error al encriptar la contraseña. Intente nuevamente",
      error
    );
  }

  // 3. Crear usuario
  let nuevoUsuario: any;
  try {
    nuevoUsuario = await createUsuario(personaId, usuario, contrasenaHash);
  } catch (error) {
    throw new AuthServiceError(
      ErrorCodes.DB_ERROR,
      "Ocurrió un error al guardar el usuario. Intenta nuevamente",
      error
    );
  }

  // 4. Retornar
  return {
    personaId: nuevoUsuario.perid,
    usuario: nuevoUsuario.usuusuario,
    activo: nuevoUsuario.usuactivo,
  };
}

// Obtener todos los usuarios (solo superAdmin)
export async function obtenerUsuarios() {
  let usuarios: any[] = [];
  try {
    usuarios = await getAllUsuariosWithPersona();
  } catch (error) {
    throw new AuthServiceError(
      ErrorCodes.DB_ERROR,
      "No fue posible consultar los usuarios",
      error
    );
  }

  return usuarios.map((row) => ({
    personaId: row.usuario.perid,
    usuario: row.usuario.usuusuario,
    activo: row.usuario.usuactivo,
    persona: {
      nombres: row.persona.pernombres,
      apellidos: row.persona.perapellidos,
      telefono: row.persona.pertelefono,
      sexo: row.persona.persexo,
      esSuperAdmin: row.persona.pertiposa,
      esAdminPlan: row.persona.pertipoap,
      esCliente: row.persona.pertipoc,
      activo: row.persona.perestado,
    },
  }));
}

// Actualizar usuario - nombre y estado (solo superAdmin)
export async function actualizarUsuario(data: any) {
  // 1. Validar con Zod
  const parsed = actualizarUsuarioSchema.safeParse(data);
  if (!parsed.success) {
    throw new AuthServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const { personaId, usuario, activo } = parsed.data;

  let usuarioActualizado: any = null;

  // 2. Actualizar nombre de usuario si se proporciona
  if (usuario) {
    try {
      usuarioActualizado = await updateUsuarioNombre(personaId, usuario);
    } catch (error) {
      throw new AuthServiceError(
        ErrorCodes.DB_ERROR,
        "Ocurrió un error al actualizar el nombre de usuario",
        error
      );
    }
  }

  // 3. Cambiar estado si se proporciona
  if (activo !== undefined) {
    try {
      usuarioActualizado = await updateUsuarioEstado(personaId, activo);
    } catch (error) {
      throw new AuthServiceError(
        ErrorCodes.DB_ERROR,
        "Ocurrió un error al cambiar el estado del usuario",
        error
      );
    }
  }

  // 4. Si no se actualizó nada, lanzar error
  if (!usuarioActualizado) {
    throw new AuthServiceError(
      ErrorCodes.VALIDATION_ERROR,
      "Debe proporcionar al menos un campo para actualizar"
    );
  }

  // 5. Retornar
  return {
    personaId: usuarioActualizado.perid,
    usuario: usuarioActualizado.usuusuario,
    activo: usuarioActualizado.usuactivo,
  };
}

// Actualizar contraseña de usuario (solo superAdmin)
export async function actualizarPasswordUsuario(data: any) {
  // 1. Validar con Zod
  const parsed = actualizarPasswordUsuarioSchema.safeParse(data);
  if (!parsed.success) {
    throw new AuthServiceError(
      ErrorCodes.VALIDATION_ERROR,
      parsed.error.issues[0]?.message ?? "Datos inválidos"
    );
  }

  const { personaId, contrasena } = parsed.data;

  // 2. Hash de contraseña
  let contrasenaHash: string;
  try {
    contrasenaHash = await hashPassword(contrasena);
  } catch (error) {
    throw new AuthServiceError(
      ErrorCodes.PASSWORD_HASH_ERROR,
      "Ocurrió un error al encriptar la contraseña. Intente nuevamente",
      error
    );
  }

  // 3. Actualizar contraseña
  let usuarioActualizado: any;
  try {
    usuarioActualizado = await updateUsuarioContrasena(
      personaId,
      contrasenaHash
    );
  } catch (error) {
    throw new AuthServiceError(
      ErrorCodes.DB_ERROR,
      "Ocurrió un error al actualizar la contraseña",
      error
    );
  }

  // 4. Retornar
  return {
    personaId: usuarioActualizado.perid,
    usuario: usuarioActualizado.usuusuario,
    activo: usuarioActualizado.usuactivo,
    mensaje: "Contraseña actualizada correctamente",
  };
}
