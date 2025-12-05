// Clase base para errores de aplicación
export class AppError extends Error {
  code: string;
  status: number;
  details?: string;
  service: string;

  constructor(
    errorObj: { CODE: string; STATUS: number; MESSAGE: string },
    details?: string,
    cause?: unknown
  ) {
    super(errorObj.MESSAGE);
    this.code = errorObj.CODE;
    this.status = errorObj.STATUS;
    this.details = details;
    this.service = "GENERAL";
    this.cause = cause;
  }
}

// Errores por servicio
export class AuthServiceError extends AppError {
  constructor(
    errorObj: { CODE: string; STATUS: number; MESSAGE: string },
    details?: string,
    cause?: unknown
  ) {
    super(errorObj, details, cause);
    this.service = "AUTH";
  }
}

export class PaymentsServiceError extends AppError {
  constructor(
    errorObj: { CODE: string; STATUS: number; MESSAGE: string },
    details?: string,
    cause?: unknown
  ) {
    super(errorObj, details, cause);
    this.service = "PAYMENTS";
  }
}

export class PlansServiceError extends AppError {
  constructor(
    errorObj: { CODE: string; STATUS: number; MESSAGE: string },
    details?: string,
    cause?: unknown
  ) {
    super(errorObj, details, cause);
    this.service = "PLANS";
  }
}

export class QuotasServiceError extends AppError {
  constructor(
    errorObj: { CODE: string; STATUS: number; MESSAGE: string },
    details?: string,
    cause?: unknown
  ) {
    super(errorObj, details, cause);
    this.service = "QUOTAS";
  }
}

export class BillingServiceError extends AppError {
  constructor(
    errorObj: { CODE: string; STATUS: number; MESSAGE: string },
    details?: string,
    cause?: unknown
  ) {
    super(errorObj, details, cause);
    this.service = "BILLING";
  }
}
