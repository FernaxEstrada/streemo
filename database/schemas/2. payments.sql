-- SCHEMA: payments
-- Metodos de pago y tarjetas

-- Tabla: Metodo de Pago
CREATE TABLE IF NOT EXISTS payments.metodopago (
    mtpid UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    mtpnombre VARCHAR(100) NOT NULL,
    mtpestado BOOLEAN NOT NULL DEFAULT TRUE
);

-- Tabla: Tarjetas
CREATE TABLE IF NOT EXISTS payments.tarjeta (
    tarid UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    taridpersona UUID NOT NULL,
    tarnumero VARCHAR(19) NOT NULL,
    tarbanco VARCHAR(50) NOT NULL,
    tarvencimiento VARCHAR(5) NOT NULL,
    tarestado BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (taridpersona) REFERENCES auth.persona (perid),
    UNIQUE (taridpersona, tarnumero)
);

-- Índices en tabla metodopago
CREATE INDEX idx_metodopago_estado ON payments.metodopago(mtpestado);

-- Índices en tabla tarjeta
CREATE INDEX idx_tarjeta_idpersona ON payments.tarjeta(taridpersona);
CREATE INDEX idx_tarjeta_estado ON payments.tarjeta(tarestado);
CREATE INDEX idx_tarjeta_banco ON payments.tarjeta(tarbanco);