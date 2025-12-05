import { AuthServiceError, ErrorCodes } from "@packages/common-http";
import jwt from "jsonwebtoken";

export type BaseClaims = {
  sub: string;
  esAdmin?: boolean;
  esTitular?: boolean;
} & Record<string, any>;

function ttlToMs(ttl: string): number {
  const match = String(ttl)
    .trim()
    .match(/^(\d+)([smhd])$/i);
  if (!match) return 0;
  const [, numStr, unitRaw] = match as RegExpMatchArray;
  const num = Number(numStr);
  const unit = String(unitRaw).toLowerCase();
  switch (unit) {
    case "s":
      return num * 1000;
    case "m":
      return num * 60 * 1000;
    case "h":
      return num * 60 * 60 * 1000;
    case "d":
      return num * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
}

// Validar variables de entorno requeridas
if (!process.env.AUTH_ACCESS_TTL) {
  console.error("[ERROR] AUTH_ACCESS_TTL no esta definido.");
  process.exit(1);
}
if (!process.env.AUTH_JWT_SECRET) {
  console.error("[ERROR] AUTH_JWT_SECRET no esta definido.");
  process.exit(1);
}

const ACCESS_TTL = process.env.AUTH_ACCESS_TTL;
const JWT_SECRET = process.env.AUTH_JWT_SECRET;

// JWT
export function signToken(claims: BaseClaims) {
  try {
    const expiresIn = ACCESS_TTL;
    const token = (jwt as any).sign(claims, JWT_SECRET, { expiresIn });
    const exp = new Date(Date.now() + ttlToMs(expiresIn));
    return { token, exp };
  } catch (error) {
    throw new AuthServiceError(
      ErrorCodes.JWT_ERROR,
      "No fue posible generar el token",
      error
    );
  }
}

export function verifyToken(token: string): BaseClaims | null {
  try {
    return (jwt as any).verify(token, JWT_SECRET) as any;
  } catch (error: any) {
    // Detectar si el token expiró
    if (error.name === "TokenExpiredError" || error.message === "jwt expired") {
      throw new AuthServiceError(
        ErrorCodes.TOKEN_EXPIRED,
        "El token ha expirado",
        error
      );
    }

    // Detectar si el token es inválido
    if (error.name === "JsonWebTokenError") {
      throw new AuthServiceError(
        ErrorCodes.TOKEN_INVALID,
        "El token no es válido",
        error
      );
    }

    // Otros errores JWT
    throw new AuthServiceError(
      ErrorCodes.JWT_ERROR,
      "No fue posible verificar el token",
      error
    );
  }
}

// Auth helpers
export function getBearerToken(c: any): string {
  const auth = c.req.header("authorization") || c.req.header("Authorization");
  if (!auth) {
    throw new AuthServiceError(
      ErrorCodes.AUTHORIZATION_ERROR,
      "No se encontro el encabezado de autorizacion"
    );
  }
  const parts = auth.split(" ");
  const token = parts.length === 2 ? parts[1] : undefined;
  if (!token) {
    throw new AuthServiceError(
      ErrorCodes.TOKEN_INVALID,
      "No fue posible obtener el token de acceso"
    );
  }
  return token;
}

export function requireAuth(c: any) {
  const token = getBearerToken(c);
  const claims = verifyToken(token) as any;
  if (!claims?.sub) {
    throw new AuthServiceError(
      ErrorCodes.TOKEN_INVALID,
      "El token no es valido"
    );
  }
  const esSuperAdmin = claims?.esSuperAdmin || false;
  const esAdminPlan = claims?.esAdminPlan || false;
  const esCliente = claims?.esCliente || false;
  const wrapper = {
    ...claims,
    EsSuperAdmin: () => esSuperAdmin === true,
    EsAdminPlan: () => esAdminPlan === true,
    EsCliente: () => esCliente === true,
  } as any;
  return wrapper;
}
