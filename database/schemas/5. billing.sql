-- SCHEMA: billing
-- Pagos de planes principales y cupos

-- Tabla: Pagos de planes principales
CREATE TABLE IF NOT EXISTS billing.pagoplanp (
    pgpid UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    pgpfechafacturacion DATE NOT NULL,
    pgpfechapago TIMESTAMP NOT NULL,
    pgpmonto NUMERIC(10, 2) NOT NULL,
    pgpmetodopago VARCHAR(50) NOT NULL,
    pgptarjeta VARCHAR(50) NOT NULL,
    pgpnota VARCHAR(200),
    pgpestado BOOLEAN NOT NULL DEFAULT TRUE,
    pgpidplanp UUID NOT NULL,
    FOREIGN KEY (pgpidplanp) REFERENCES plans.planprincipal (priid)
);

CREATE TABLE IF NOT EXISTS billing.pagocupo (
    pgcid UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    pgcfechafacturacion DATE NOT NULL,
    pgcfechapago TIMESTAMP NOT NULL,
    pgcmesespagados INT NOT NULL,
    pgcmonto NUMERIC(10, 2) NOT NULL,
    pgcmetodopago VARCHAR(100) NOT NULL,
    pgcnota VARCHAR(200),
    pgcestado BOOLEAN NOT NULL DEFAULT TRUE,
    pgcidcupovendido UUID NOT NULL,
    FOREIGN KEY (pgcidcupovendido) REFERENCES quotas.cupovendido (cveid)
);

-- Índices en tabla pagoplanp
CREATE INDEX idx_pagoplanp_idplanp ON billing.pagoplanp(pgpidplanp);
CREATE INDEX idx_pagoplanp_estado ON billing.pagoplanp(pgpestado);
CREATE INDEX idx_pagoplanp_fechapago ON billing.pagoplanp(pgpfechapago);

-- Índices en tabla pagocupo
CREATE INDEX idx_pagocupo_idcupovendido ON billing.pagocupo(pgcidcupovendido);
CREATE INDEX idx_pagocupo_estado ON billing.pagocupo(pgcestado);
CREATE INDEX idx_pagocupo_fechapago ON billing.pagocupo(pgcfechapago);