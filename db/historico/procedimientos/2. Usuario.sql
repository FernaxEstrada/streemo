-- Active: 1733797865142@@127.0.0.1@5432@streemodb
-- PROCEDIMIENTOS USUARIO
-- 1. Procedimiento para crear usuario
CREATE OR REPLACE PROCEDURE pa_crear_usuario(
    p_IdPersona UUID,
    p_Usuario VARCHAR(100),
    p_Contrasena VARCHAR(60)
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF NOT EXISTS (SELECT 1 FROM Persona WHERE IdPersona = p_IdPersona) THEN
        RAISE EXCEPTION 'No existe la persona con Id %', p_IdPersona;
    END IF;

    INSERT INTO Usuario (
        IdPersona, Usuario, Contrasena
    )
    VALUES (
        p_IdPersona, p_Usuario, p_Contrasena
    );

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al crear usuario: %', SQLERRM;
END;
$$;

-- 2. Procedimiento para actualizar nombre de usuario
CREATE OR REPLACE PROCEDURE pa_actualizar_usuario(
    p_IdPersona UUID,
    p_NuevoUsuario VARCHAR(100)
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF EXISTS (
        SELECT 1 FROM Usuario
        WHERE IdPersona = p_IdPersona AND Estado = FALSE
    ) THEN
        RAISE EXCEPTION 'Usuario inhabilitado. No se puede modificar.';
    END IF;

    UPDATE Usuario
    SET Usuario = p_NuevoUsuario
    WHERE IdPersona = p_IdPersona;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró usuario con IdPersona %', p_IdPersona;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar usuario: %', SQLERRM;
END;
$$;

-- 3. Procedimiento para actualizar contraseña
CREATE OR REPLACE PROCEDURE pa_actualizar_contrasena(
    p_IdPersona UUID,
    p_NuevaContrasena VARCHAR(60)
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF EXISTS (
        SELECT 1 FROM Usuario
        WHERE IdPersona = p_IdPersona AND Estado = FALSE
    ) THEN
        RAISE EXCEPTION 'Usuario inhabilitado. No se puede modificar.';
    END IF;

    UPDATE Usuario
    SET Contrasena = p_NuevaContrasena
    WHERE IdPersona = p_IdPersona;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró usuario con IdPersona %', p_IdPersona;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar contraseña: %', SQLERRM;
END;
$$;

-- 4. Procedimiento para cambiar estado del usuario (habilitar/deshabilitar)
CREATE OR REPLACE PROCEDURE pa_cambiar_estado_usuario(
    p_IdPersona UUID,
    p_Estado BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN

    UPDATE Usuario
    SET Estado = p_Estado
    WHERE IdPersona = p_IdPersona;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró usuario con IdPersona %', p_IdPersona;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al cambiar el estado del usuario: %', SQLERRM;
END;
$$;