-- ELIMINACION DE LA BASE DE DATOS
-- ADVERTENCIA: SCRIPT OBSOLETO / ARCHIVADO
-- No ejecute este archivo directamente en pgAdmin.
-- En su lugar, use los scripts divididos:
--   1) db/00_database.sql  (conectado a base 'postgres')
--   2) db/01_schema.sql    (conectado a base 'streemodb')
--   3) db/02_procedimientos.sql (opcional, procedimientos)
-- Nota: pgAdmin NO soporta el comando psql "\connect" incluido más abajo.
-- Mantener este archivo solo como referencia histórica.

DROP DATABASE IF EXISTS streemodb;

-- CREACION DE LA BASE DE DATOS
CREATE DATABASE streemodb;

-- Conectarse a la base de datos creada (psql)
\connect streemodb

-- HABILITACION DE LA EXTENCION PGCRYPTO PARA GENERAR UUIDs.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- CREACION DE LAS TABLAS
CREATE TABLE Persona (
    IdPersona UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    Nombres VARCHAR(100) NOT NULL,
    Apellidos VARCHAR(100) NOT NULL,
    Telefono VARCHAR(15) NOT NULL,
    Sexo CHAR(1) NOT NULL,
    TipoAP BOOLEAN NOT NULL,
    TipoC BOOLEAN NOT NULL,
    TipoSA BOOLEAN NOT NULL,
    Estado BOOLEAN NOT NULL DEFAULT TRUE
)

CREATE TABLE Usuario (
    IdPersona UUID PRIMARY KEY,
    Usuario VARCHAR(100) NOT NULL,
    Contrasena VARCHAR(60) NOT NULL,
    Estado BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (IdPersona) REFERENCES Persona (IdPersona),
    UNIQUE (Usuario)
)

CREATE TABLE MetodoPago (
    IdMetPago UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    Nombre VARCHAR(100) NOT NULL,
    Estado BOOLEAN NOT NULL DEFAULT TRUE
)

CREATE TABLE Tarjeta (
    IdTarjeta UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    IdPersona UUID NOT NULL,
    Numero VARCHAR(19) NOT NULL,
    Banco VARCHAR(50) NOT NULL,
    Vencimiento VARCHAR(5) NOT NULL,
    Estado BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (IdPersona) REFERENCES Persona (IdPersona),
    UNIQUE (IdPersona, Numero)
)

CREATE TABLE PlanPrincipal (
    IdPlanP UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    NombrePlan VARCHAR(100) NOT NULL,
    Correo VARCHAR(100) NOT NULL,
    FechaInicio DATE NOT NULL,
    Costo NUMERIC(10, 2) NOT NULL CHECK (Costo > 0),
    ProxPago DATE,
    DireccionPlan VARCHAR(200) NOT NULL,
    Estado BOOLEAN NOT NULL DEFAULT TRUE,
    IdPersona UUID NOT NULL,
    IdMetPago UUID NOT NULL,
    IdTarjeta UUID NOT NULL,
    FOREIGN KEY (IdPersona) REFERENCES Persona (IdPersona),
    FOREIGN KEY (IdMetPago) REFERENCES MetodoPago (IdMetPago),
    FOREIGN KEY (IdTarjeta) REFERENCES Tarjeta (IdTarjeta),
    UNIQUE (NombrePlan)
)

CREATE TABLE PagoPlan (
    IdPagoPlan UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    FechaFacturacion DATE NOT NULL,
    FechaPago TIMESTAMP NOT NULL,
    Monto NUMERIC(10, 2) NOT NULL,
    MetodoPago VARCHAR(50) NOT NULL,
    Tarjeta VARCHAR(50) NOT NULL,
    Nota VARCHAR(200),
    Estado BOOLEAN NOT NULL DEFAULT TRUE,
    IdPlanP UUID NOT NULL,
    FOREIGN KEY (IdPlanP) REFERENCES PlanPrincipal (IdPlanP)
)

CREATE TABLE PlanCupo (
    IdPlanCupo UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    TipoPlan VARCHAR(50) NOT NULL,
    DuracionMes INT NOT NULL,
    Promo BOOLEAN NOT NULL,
    Precio NUMERIC(10, 2) NOT NULL,
    Estado BOOLEAN NOT NULL DEFAULT TRUE
)

CREATE TABLE CupoVendido (
    IdCupo UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    Usuario VARCHAR(100) NOT NULL,
    FechaInicio DATE NOT NULL,
    ProxPago DATE,
    Nota VARCHAR(200),
    Estado BOOLEAN NOT NULL DEFAULT TRUE,
    IdPersona UUID NOT NULL,
    IdPlanP UUID NOT NULL,
    IdPlanCupo UUID NOT NULL,
    IdMetPago UUID NOT NULL,
    FOREIGN KEY (IdPersona) REFERENCES Persona (IdPersona),
    FOREIGN KEY (IdPlanP) REFERENCES PlanPrincipal (IdPlanP),
    FOREIGN KEY (IdPlanCupo) REFERENCES PlanCupo (IdPlanCupo),
    FOREIGN KEY (IdMetPago) REFERENCES MetodoPago (IdMetPago)
)

CREATE TABLE PagoCupo (
    IdPagoCupo UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    FechaFacturacion DATE NOT NULL,
    FechaPago TIMESTAMP NOT NULL,
    MesesPagados INT NOT NULL,
    Monto NUMERIC(10, 2) NOT NULL,
    MetodoPago VARCHAR(100) NOT NULL,
    Nota VARCHAR(200),
    Estado BOOLEAN NOT NULL DEFAULT TRUE,
    IdCupo UUID NOT NULL,
    FOREIGN KEY (IdCupo) REFERENCES CupoVendido (IdCupo)
)

-- ============================================================
-- USUARIO APLICATIVO Y PRIVILEGIOS
-- Nota: Ajusta los datos de Telefono/Sexo si corresponde.
-- ============================================================

-- Crear el rol de base de datos si no existe (sin contraseña por ahora)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'feresdev') THEN
    CREATE ROLE feresdev LOGIN;
  END IF;
END $$;

-- Asignar/actualizar contraseña del rol
ALTER ROLE feresdev WITH PASSWORD 'feresdev2025a*';

-- Conceder privilegios amplios sobre el esquema public y objetos
GRANT CONNECT, CREATE, TEMPORARY ON DATABASE streemodb TO feresdev;
GRANT USAGE, CREATE ON SCHEMA public TO feresdev;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO feresdev;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO feresdev;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO feresdev;

-- Privilegios por defecto para futuros objetos
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO feresdev;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO feresdev;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO feresdev;

-- Inserción/actualización idempotente de la persona y usuario de la aplicación
DO $$
DECLARE
  v_idpersona uuid;
BEGIN
  -- Buscar si ya existe el usuario
  SELECT p.IdPersona INTO v_idpersona
  FROM Usuario u
  JOIN Persona p ON p.IdPersona = u.IdPersona
  WHERE u.Usuario = 'feresdev';

  IF v_idpersona IS NULL THEN
    v_idpersona := gen_random_uuid();
    INSERT INTO Persona (
      IdPersona, Nombres, Apellidos, Telefono, Sexo, TipoAP, TipoC, TipoSA, Estado
    ) VALUES (
      v_idpersona,
      'Fernando',
      'Achocalla Estrada',
      '67786830',
      'M',
      TRUE, TRUE, TRUE,
      TRUE
    );

    INSERT INTO Usuario (IdPersona, Usuario, Contrasena, Estado)
    VALUES (v_idpersona, 'feresdev', '$2b$10$h5AgmXoOuPbPVGmSvIw28ee1I.NvsjJ5XC2Dsno1giwuI6PufV6Y.', TRUE);
  ELSE
    -- Si existe, actualizamos la contraseña por si cambió
    UPDATE Usuario
    SET Contrasena = '$2b$10$h5AgmXoOuPbPVGmSvIw28ee1I.NvsjJ5XC2Dsno1giwuI6PufV6Y.'
    WHERE Usuario = 'feresdev';
  END IF;
END $$;
