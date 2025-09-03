import { AuthError } from "../../types/errors";
import { NextRequest } from "next/server";
import { verifyToken } from "./verifyToken";

export async function authGuard(req: NextRequest) {
  const authHeader = await req.headers.get("Authorization");

  if (!authHeader) {
    throw new AuthError("Encabezado de autorización no proporcionado");
  }

  const token = authHeader?.split(" ")[1];
  if (!token) throw new AuthError("Token no proporcionado");

  const decoded = verifyToken(token);
  return decoded;
}
