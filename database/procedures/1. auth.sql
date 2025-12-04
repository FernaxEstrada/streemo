-- SCHEMA: auth
-- Gestión de identidad y autenticación

-- 1. Registrar persona
CREATE OR REPLACE PROCEDURE auth.pa_registrar_persona(
    p_pernombres VARCHAR(100),
    p_perapellidos VARCHAR(100),
    p_pertelefono VARCHAR(15),
    p_persexo CHAR(1),
    p_pertipoap BOOLEAN,
    p_pertipoc BOOLEAN,
    p_pertiposa BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF EXISTS (SELECT 1 FROM auth.persona WHERE pertelefono = p_pertelefono AND perestado = TRUE) THEN
        RAISE EXCEPTION 'Persona ya registrada.';
    END IF;

    INSERT INTO auth.persona (
        pernombres, perapellidos, pertelefono, persexo,
        pertipoap, pertipoc, pertiposa
    )
    VALUES (
        p_pernombres, p_perapellidos, p_pertelefono, p_persexo,
        p_pertipoap, p_pertipoc, p_pertiposa
    );
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al registrar persona: %', SQLERRM;
END;
$$;

-- 2. Actualizar datos de persona
CREATE OR REPLACE PROCEDURE auth.pa_actualizar_datos_persona(
    p_perid UUID,
    p_pernombres VARCHAR(100),
    p_perapellidos VARCHAR(100),
    p_pertelefono VARCHAR(15),
    p_persexo CHAR(1)
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM auth.persona WHERE perid = p_perid AND perestado = FALSE) THEN
        RAISE EXCEPTION 'Persona inhabilitada. No se puede modificar.';
    END IF;

    UPDATE auth.persona
    SET
        pernombres = p_pernombres,
        perapellidos = p_perapellidos,
        pertelefono = p_pertelefono,
        persexo = p_persexo
    WHERE perid = p_perid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró la persona con perid %', p_perid;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar datos de persona: %', SQLERRM;
END;
$$;

-- 3. Actualizar roles de persona
CREATE OR REPLACE PROCEDURE auth.pa_actualizar_roles_persona(
    p_perid UUID,
    p_pertipoap BOOLEAN,
    p_pertipoc BOOLEAN,
    p_pertiposa BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM auth.persona WHERE perid = p_perid AND perestado = FALSE) THEN
        RAISE EXCEPTION 'Persona inhabilitada. No se puede modificar.';
    END IF;

    UPDATE auth.persona
    SET
        pertipoap = p_pertipoap,
        pertipoc = p_pertipoc,
        pertiposa = p_pertiposa
    WHERE perid = p_perid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró la persona con perid %', p_perid;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar roles de persona: %', SQLERRM;
END;
$$;

-- 4. Cambiar estado de persona
CREATE OR REPLACE PROCEDURE auth.pa_cambiar_estado_persona(
    p_perid UUID,
    p_perestado BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE auth.persona
    SET perestado = p_perestado
    WHERE perid = p_perid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró la persona con perid %', p_perid;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al cambiar el estado de persona: %', SQLERRM;
END;
$$;

-- 5. Crear usuario
CREATE OR REPLACE PROCEDURE auth.pa_crear_usuario(
    p_perid UUID,
    p_usuusuario VARCHAR(100),
    p_usucontrasena VARCHAR(60)
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM auth.persona WHERE perid = p_perid) THEN
        RAISE EXCEPTION 'No existe la persona con perid %', p_perid;
    END IF;

    INSERT INTO auth.usuario (perid, usuusuario, usucontrasena)
    VALUES (p_perid, p_usuusuario, p_usucontrasena);
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al crear usuario: %', SQLERRM;
END;
$$;

-- 6. Actualizar nombre de usuario
CREATE OR REPLACE PROCEDURE auth.pa_actualizar_usuario(
    p_perid UUID,
    p_usuusuario VARCHAR(100)
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM auth.usuario WHERE perid = p_perid AND usuactivo = FALSE) THEN
        RAISE EXCEPTION 'Usuario inhabilitado. No se puede modificar.';
    END IF;

    UPDATE auth.usuario
    SET usuusuario = p_usuusuario
    WHERE perid = p_perid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró usuario con perid %', p_perid;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar usuario: %', SQLERRM;
END;
$$;

-- 7. Actualizar contraseña
CREATE OR REPLACE PROCEDURE auth.pa_actualizar_contrasena(
    p_perid UUID,
    p_usucontrasena VARCHAR(60)
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM auth.usuario WHERE perid = p_perid AND usuactivo = FALSE) THEN
        RAISE EXCEPTION 'Usuario inhabilitado. No se puede modificar.';
    END IF;

    UPDATE auth.usuario
    SET usucontrasena = p_usucontrasena
    WHERE perid = p_perid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró usuario con perid %', p_perid;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar contraseña: %', SQLERRM;
END;
$$;

-- 8. Cambiar estado de usuario
CREATE OR REPLACE PROCEDURE auth.pa_cambiar_estado_usuario(
    p_perid UUID,
    p_usuactivo BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE auth.usuario
    SET usuactivo = p_usuactivo
    WHERE perid = p_perid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró usuario con perid %', p_perid;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al cambiar el estado del usuario: %', SQLERRM;
END;
$$;
