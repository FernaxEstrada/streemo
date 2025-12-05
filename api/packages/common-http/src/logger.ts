import type { Context } from "hono";
import { AppError } from "./errors";
import { DrizzleQueryError } from "drizzle-orm";
import { formatDateToDDMMYYYY } from "./dateFormatter";

function nowIso() {
  return new Date().toISOString();
}

type ErrorLogMeta = Record<string, unknown>;

function buildPayload(options: {
  error: AppError;
  method?: string;
  path?: string;
  url?: string;
  meta?: ErrorLogMeta;
}) {
  const { error, method, path, url, meta } = options;

  let causeMessage: string | undefined = undefined;
  let causeDetails: string | unknown | undefined = undefined;
  let causeCode: string | undefined = undefined;
  let causeStatus: number | undefined = undefined;
  let causeService: string | undefined = undefined;

  if (error.cause && error.cause instanceof AppError) {
    causeMessage = error.cause.message;
    causeDetails = error.cause.details;
    causeCode = error.cause.code;
    causeStatus = error.cause.status;
    causeService = error.cause.service;
  }

  if (error.cause && error.cause instanceof DrizzleQueryError) {
    const pgError = error.cause.cause as any;
    causeMessage = error.cause.cause?.message;
    causeDetails = pgError?.hint;
    causeCode = pgError?.code;
    causeStatus = pgError?.severity;
    causeService = "DRIZZLE-QUERY";
  }

  const payload: Record<string, unknown> = {
    time: formatDateToDDMMYYYY(nowIso()),
    error: {
      code: error.code,
      service: error.service,
      message: error.message,
      details: error.details,
      cause: error.cause
        ? {
            message: causeMessage,
            details: causeDetails,
            code: causeCode,
            status: causeStatus,
            service: causeService,
          }
        : undefined,
    },
    request: {
      method,
      status: error.status,
      path,
      url,
    },
    meta: meta,
  };

  return payload;
}

function emit(payload: Record<string, unknown>) {
  console.error(JSON.stringify(payload));
}

export function logError(c: Context, error: AppError) {
  const payload = buildPayload({
    error,
    method: c.req.method,
    path: c.req.path,
    url: c.req.url,
  });

  emit(payload);
}

export function logErrorEvent(error: AppError, meta?: ErrorLogMeta) {
  const payload = buildPayload({ error, meta });
  emit(payload);
}
