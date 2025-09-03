-- Active: 1733797865142@@127.0.0.1@5432@streemodb
-- PROCEDIMIENTOS PERSONA
-- 1. Procedimiento para registrar persona
CREATE OR REPLACE PROCEDURE pa_registrar_persona(
    p_Nombres VARCHAR(100),
    p_Apellidos VARCHAR(100),
    p_Telefono VARCHAR(15),
    p_Sexo CHAR(1),
    p_TipoAP BOOLEAN,
    p_TipoC BOOLEAN,
    p_TipoSA BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN

    INSERT INTO Persona (
        Nombres, Apellidos, Telefono, Sexo,
        TipoAP, TipoC, TipoSA
    )
    VALUES (
        p_Nombres, p_Apellidos, p_Telefono, p_Sexo,
        p_TipoAP, p_TipoC, p_TipoSA
    );

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al registrar persona: %', SQLERRM;
END;
$$;

-- 2. Procedimiento para actualizar datos personales
CREATE OR REPLACE PROCEDURE pa_actualizar_datos_persona(
    p_IdPersona UUID,
    p_Nombres VARCHAR(100),
    p_Apellidos VARCHAR(100),
    p_Telefono VARCHAR(15),
    p_Sexo CHAR(1)
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF EXISTS (
        SELECT 1 FROM Persona
        WHERE IdPersona = p_IdPersona AND Estado = FALSE
    ) THEN
        RAISE EXCEPTION 'Persona inhabilitada. No se puede modificar.';
    END IF;

    UPDATE Persona
    SET
        Nombres = p_Nombres,
        Apellidos = p_Apellidos,
        Telefono = p_Telefono,
        Sexo = p_Sexo
    WHERE IdPersona = p_IdPersona;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró la persona con IdPersona %', p_IdPersona;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar datos personales: %', SQLERRM;
END;
$$;

-- 3. Procedimiento para actualizar roles
CREATE OR REPLACE PROCEDURE pa_actualizar_roles_persona(
    p_IdPersona UUID,
    p_TipoAP BOOLEAN,
    p_TipoC BOOLEAN,
    p_TipoSA BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF EXISTS (
        SELECT 1 FROM Persona
        WHERE IdPersona = p_IdPersona AND Estado = FALSE
    ) THEN
        RAISE EXCEPTION 'Persona inhabilitada. No se puede modificar.';
    END IF;

    UPDATE Persona
    SET
        TipoAP = p_TipoAP,
        TipoC = p_TipoC,
        TipoSA = p_TipoSA
    WHERE IdPersona = p_IdPersona;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró la persona con IdPersona %', p_IdPersona;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar roles: %', SQLERRM;
END;
$$;

-- 4. Procedimiento para cambiar estado (habilitar/deshabilitar)
CREATE OR REPLACE PROCEDURE pa_cambiar_estado_persona(
    p_IdPersona UUID,
    p_Estado BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN

    UPDATE Persona
    SET Estado = p_Estado
    WHERE IdPersona = p_IdPersona;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró la persona con IdPersona %', p_IdPersona;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al cambiar el estado: %', SQLERRM;
END;
$$;