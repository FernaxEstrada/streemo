import { SignOptions } from "jsonwebtoken";

export type JWTExpireIn = SignOptions["expiresIn"];

export type JWTPayload = string | object | Buffer;

export type DecodedToken = string | JWTPayload;
