-- SCHEMA: payments
-- Metodos de pago y tarjetas

-- 1. Crear método de pago
CREATE OR REPLACE PROCEDURE payments.pa_crear_metodo_pago(
    p_mtpnombre VARCHAR(100)
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO payments.metodopago (mtpnombre)
    VALUES (p_mtpnombre);
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al crear método de pago: %', SQLERRM;
END;
$$;

-- 2. Actualizar método de pago
CREATE OR REPLACE PROCEDURE payments.pa_actualizar_metodo_pago(
    p_mtpid UUID,
    p_mtpnombre VARCHAR(100)
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM payments.metodopago WHERE mtpid = p_mtpid AND mtpestado = FALSE) THEN
        RAISE EXCEPTION 'Método de pago inhabilitado. No se puede modificar';
    END IF;

    UPDATE payments.metodopago
    SET mtpnombre = p_mtpnombre
    WHERE mtpid = p_mtpid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró método de pago con mtpid %', p_mtpid;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar método de pago: %', SQLERRM;
END;
$$;

-- 3. Cambiar estado de método de pago
CREATE OR REPLACE PROCEDURE payments.pa_cambiar_estado_metodo_pago(
    p_mtpid UUID,
    p_mtpestado BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE payments.metodopago
    SET mtpestado = p_mtpestado
    WHERE mtpid = p_mtpid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró método de pago con mtpid %', p_mtpid;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al cambiar estado del método de pago: %', SQLERRM;
END;
$$;

-- 4. Registrar tarjeta
CREATE OR REPLACE PROCEDURE payments.pa_registrar_tarjeta(
    p_taridpersona UUID,
    p_tarnumero VARCHAR(19),
    p_tarbanco VARCHAR(50),
    p_tarvencimiento VARCHAR(5)
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM auth.persona WHERE perid = p_taridpersona AND perestado = TRUE) THEN
        RAISE EXCEPTION 'Persona inactiva o no encontrada: %', p_taridpersona;
    END IF;

    INSERT INTO payments.tarjeta (taridpersona, tarnumero, tarbanco, tarvencimiento)
    VALUES (p_taridpersona, p_tarnumero, p_tarbanco, p_tarvencimiento);
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al registrar tarjeta: %', SQLERRM;
END;
$$;

-- 5. Cambiar estado de tarjeta
CREATE OR REPLACE PROCEDURE payments.pa_cambiar_estado_tarjeta(
    p_tarid UUID,
    p_tarestado BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE payments.tarjeta
    SET tarestado = p_tarestado
    WHERE tarid = p_tarid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró tarjeta con tarid %', p_tarid;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al cambiar estado de la tarjeta: %', SQLERRM;
END;
$$;
