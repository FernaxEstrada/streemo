import jwt from "jsonwebtoken";
import { JWTExpireIn, JWTPayload } from "../../types/jwt";
import { env } from "../../utils/env";

export function generateToken(
  payload: JWTPayload,
  expiresIn: JWTExpireIn = "1d"
) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
}
