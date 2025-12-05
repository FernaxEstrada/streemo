// Codigos de error
export const ErrorCodes = {
  NOT_FOUND: {
    CODE: "C0001",
    STATUS: 404,
    MESSAGE: "Recurso no encontrado",
  },
  VALIDATION_ERROR: {
    CODE: "C0002",
    STATUS: 400,
    MESSAGE: "Error de validacion",
  },
  INVALID_CREDENTIALS: {
    CODE: "C0003",
    STATUS: 400,
    MESSAGE: "Credenciales inválidas",
  },
  TOKEN_INVALID: {
    CODE: "C0004",
    STATUS: 401,
    MESSAGE: "Token inválido",
  },
  TOKEN_EXPIRED: {
    CODE: "C0005",
    STATUS: 401,
    MESSAGE: "Token expirado",
  },
  USER_INACTIVE: {
    CODE: "C0006",
    STATUS: 403,
    MESSAGE: "Usuario inactivo",
  },
  DB_ERROR: {
    CODE: "C0007",
    STATUS: 500,
    MESSAGE: "Error de base de datos",
  },
  PASSWORD_HASH_ERROR: {
    CODE: "C0008",
    STATUS: 500,
    MESSAGE: "Error al encriptar contraseña",
  },
  AUTHORIZATION_ERROR: {
    CODE: "C0009",
    STATUS: 401,
    MESSAGE: "Autorización ausente",
  },
  JWT_ERROR: {
    CODE: "C0010",
    STATUS: 500,
    MESSAGE: "Error al generar token",
  },
  PERMISSION_DENIED: {
    CODE: "C0011",
    STATUS: 403,
    MESSAGE: "Permiso denegado",
  },
} as const;
