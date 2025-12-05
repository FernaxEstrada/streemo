import apiResponse from "./response";
import { AppError } from "./errors";
import type { Context } from "hono";
import { logError } from "./logger";

function isCodeLike(s: string | undefined): boolean {
  if (!s) return false;
  return /^[A-Z]+_[A-Z]+(?:_[A-Z]+)*_\d+$/.test(s);
}

export default function apiResponseError(c: Context, error: unknown) {
  const errorObj = error as any;
  let message: string;
  let code: string;
  let status: number;
  let details: string | undefined;
  let service: string;

  if (error instanceof AppError) {
    message = error.message;
    code = error.code;
    status = error.status;
    details = error.details;
    service = error.service;
  } else {
    message =
      errorObj?.message ||
      (error instanceof Error ? error.message : "Error desconocido");
    code = errorObj?.code;
    if (!code && typeof message === "string" && isCodeLike(message)) {
      code = message;
    }
    status = errorObj?.status || 500;
    details = errorObj?.details;
    service = "GENERAL";
  }

  logError(c, error as AppError);

  return apiResponse(
    { response: c },
    {
      data: null,
      error: {
        message: message,
        details: details,
      },
      ok: false,
    },
    { status: status as any }
  );
}
