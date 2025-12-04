-- SCHEMA: plans
-- Planes principales y planes de cupos

-- Tabla: Plan Principal
CREATE TABLE IF NOT EXISTS plans.planprincipal (
    priid UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    prinombre VARCHAR(100) NOT NULL,
    pricorreo VARCHAR(100) NOT NULL,
    prifechainicio DATE NOT NULL,
    pricosto NUMERIC(10, 2) NOT NULL CHECK (pricosto > 0),
    priproxpago DATE,
    pridireccion VARCHAR(200) NOT NULL,
    priestado BOOLEAN NOT NULL DEFAULT TRUE,
    priidpersona UUID NOT NULL,
    priidmetpago UUID NOT NULL,
    priidtarjeta UUID NOT NULL,
    FOREIGN KEY (priidpersona) REFERENCES auth.persona (perid),
    FOREIGN KEY (priidmetpago) REFERENCES payments.metodopago (mtpid),
    FOREIGN KEY (priidtarjeta) REFERENCES payments.tarjeta (tarid),
    UNIQUE (prinombre)
);

-- Tabla: Plan Cupo
CREATE TABLE IF NOT EXISTS plans.plancupo (
    cupid UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    cupnombre VARCHAR(50) NOT NULL,
    cupduracionmeses INT NOT NULL,
    cuppromocion BOOLEAN NOT NULL,
    cupprecio NUMERIC(10, 2) NOT NULL,
    cupestado BOOLEAN NOT NULL DEFAULT TRUE
);

-- Índices en tabla principal
CREATE INDEX idx_principal_idpersona ON plans.planprincipal(priidpersona);
CREATE INDEX idx_principal_estado ON plans.planprincipal(priestado);
CREATE INDEX idx_principal_proxpago ON plans.planprincipal(priproxpago);

-- Índices en tabla cupo
CREATE INDEX idx_cupo_estado ON plans.plancupo(cupestado);
CREATE INDEX idx_cupo_promocion ON plans.plancupo(cuppromocion);