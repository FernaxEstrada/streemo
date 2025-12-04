-- SCHEMA: auth
-- Gestión de identidad y autenticación

-- Tabla: Persona
CREATE TABLE IF NOT EXISTS auth.persona (
    perid UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    pernombres VARCHAR(100) NOT NULL,
    perapellidos VARCHAR(100) NOT NULL,
    pertelefono VARCHAR(15) NOT NULL,
    persexo CHAR(1) NOT NULL,
    pertipoap BOOLEAN NOT NULL,
    pertipoc BOOLEAN NOT NULL,
    pertiposa BOOLEAN NOT NULL,
    perestado BOOLEAN NOT NULL DEFAULT TRUE
);

-- Tabla: Usuario
CREATE TABLE IF NOT EXISTS auth.usuario (
    perid UUID PRIMARY KEY,
    usuusuario VARCHAR(100) NOT NULL,
    usucontrasena VARCHAR(60) NOT NULL,
    usuactivo BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (perid) REFERENCES auth.persona (perid),
    UNIQUE (usuusuario)
);

-- Índices en tabla persona
CREATE INDEX idx_persona_telefono ON auth.persona(pertelefono);
CREATE INDEX idx_persona_estado ON auth.persona(perestado);

-- Índices en tabla usuario
CREATE INDEX idx_usuario_perid ON auth.usuario(perid);
CREATE INDEX idx_usuario_activo ON auth.usuario(usuactivo);

-- Insersion del superAdmin
-- Password por defecto: 123456 (hash bcrypt: $2b$10$VnnuGbwitqWLMTzNu8i0KebEpkvZubQeiFeKM.IuPWJzWlzBiKEtS)
INSERT INTO auth.persona (perid, pernombres, perapellidos, pertelefono, persexo, pertipoap, pertipoc, pertiposa, perestado)
VALUES ('d1987182-5567-4119-a664-c7961bab2a70', 'Fernando', 'Estrada', '67786830', 'M', TRUE, TRUE, TRUE, TRUE);

INSERT INTO auth.usuario (perid, usuusuario, usucontrasena, usuactivo) VALUES
('d1987182-5567-4119-a664-c7961bab2a70', 'feresdev', '$2b$10$VnnuGbwitqWLMTzNu8i0KebEpkvZubQeiFeKM.IuPWJzWlzBiKEtS', TRUE);