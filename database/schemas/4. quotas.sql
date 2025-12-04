-- SCHEMA: quotas
-- Venta de cupos

-- Tabla: Cupos vendidos
CREATE TABLE IF NOT EXISTS quotas.cupovendido (
    cveid UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    cveusuario VARCHAR(100) NOT NULL,
    cvefechainicio DATE NOT NULL,
    cveproxpago DATE,
    cvenota VARCHAR(200),
    cveestado BOOLEAN NOT NULL DEFAULT TRUE,
    cveidpersona UUID NOT NULL,
    cveidplanp UUID NOT NULL,
    cveidplancupo UUID NOT NULL,
    cveidmetpago UUID NOT NULL,
    FOREIGN KEY (cveidpersona) REFERENCES auth.persona (perid),
    FOREIGN KEY (cveidplanp) REFERENCES plans.planprincipal (priid),
    FOREIGN KEY (cveidplancupo) REFERENCES plans.plancupo (cupid),
    FOREIGN KEY (cveidmetpago) REFERENCES payments.metodopago (mtpid)
);

-- Índices en tabla cupovendido
CREATE INDEX idx_cupovendido_idpersona ON quotas.cupovendido(cveidpersona);
CREATE INDEX idx_cupovendido_estado ON quotas.cupovendido(cveestado);
CREATE INDEX idx_cupovendido_proxpago ON quotas.cupovendido(cveproxpago);
CREATE INDEX idx_cupovendido_idplanp ON quotas.cupovendido(cveidplanp);