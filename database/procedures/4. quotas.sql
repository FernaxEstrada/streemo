-- SCHEMA: quotas
-- Venta de cupos

-- 1. Insertar cupo vendido
CREATE OR REPLACE PROCEDURE quotas.pa_insertar_cupo_vendido(
    p_cveidpersona UUID,
    p_cveidplanp UUID,
    p_cveidplancupo UUID,
    p_cveidmetpago UUID,
    p_cveusuario VARCHAR(100),
    p_cvefechainicio DATE,
    p_cvenota VARCHAR(200)
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM auth.persona WHERE perid = p_cveidpersona AND perestado = TRUE) THEN
        RAISE EXCEPTION 'La persona no está activa o no existe';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM plans.planprincipal WHERE priid = p_cveidplanp AND priestado = TRUE) THEN
        RAISE EXCEPTION 'El plan principal no está activo o no existe';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM plans.plancupo WHERE cupid = p_cveidplancupo AND cupestado = TRUE) THEN
        RAISE EXCEPTION 'El plan del cupo no está activo o no existe';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM payments.metodopago WHERE mtpid = p_cveidmetpago AND mtpestado = TRUE) THEN
        RAISE EXCEPTION 'El método de pago no está activo o no existe';
    END IF;

    INSERT INTO quotas.cupovendido (
        cveidpersona, cveidplanp, cveidplancupo, cveidmetpago,
        cveusuario, cvefechainicio, cvenota
    )
    VALUES (
        p_cveidpersona, p_cveidplanp, p_cveidplancupo, p_cveidmetpago,
        p_cveusuario, p_cvefechainicio, p_cvenota
    );
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al insertar el cupo: %', SQLERRM;
END;
$$;

-- 2. Actualizar datos del cupo vendido
CREATE OR REPLACE PROCEDURE quotas.pa_actualizar_datos_cupo_vendido(
    p_cveid UUID,
    p_cveusuario VARCHAR(100),
    p_cvenota VARCHAR(200)
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM quotas.cupovendido WHERE cveid = p_cveid AND cveestado = TRUE) THEN
        RAISE EXCEPTION 'El cupo no existe o está inactivo';
    END IF;

    UPDATE quotas.cupovendido
    SET
        cveusuario = p_cveusuario,
        cvenota = p_cvenota
    WHERE cveid = p_cveid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el cupo con cveid: %', p_cveid;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar datos del cupo: %', SQLERRM;
END;
$$;

-- 3. Cambiar plan del cupo vendido
CREATE OR REPLACE PROCEDURE quotas.pa_cambiar_plan_cupo_vendido(
    p_cveid UUID,
    p_cveidplancupo UUID
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM quotas.cupovendido WHERE cveid = p_cveid AND cveestado = TRUE) THEN
        RAISE EXCEPTION 'El cupo no existe o está inactivo';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM plans.plancupo WHERE cupid = p_cveidplancupo AND cupestado = TRUE) THEN
        RAISE EXCEPTION 'El nuevo plan está inactivo o no existe';
    END IF;

    UPDATE quotas.cupovendido
    SET cveidplancupo = p_cveidplancupo
    WHERE cveid = p_cveid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el cupo con cveid: %', p_cveid;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al cambiar el plan del cupo: %', SQLERRM;
END;
$$;

-- 4. Cambiar método de pago del cupo vendido
CREATE OR REPLACE PROCEDURE quotas.pa_cambiar_metodo_pago_cupo_vendido(
    p_cveid UUID,
    p_cveidmetpago UUID
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM quotas.cupovendido WHERE cveid = p_cveid AND cveestado = TRUE) THEN
        RAISE EXCEPTION 'El cupo no existe o está inactivo';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM payments.metodopago WHERE mtpid = p_cveidmetpago AND mtpestado = TRUE) THEN
        RAISE EXCEPTION 'Método de pago no válido o inactivo';
    END IF;

    UPDATE quotas.cupovendido
    SET cveidmetpago = p_cveidmetpago
    WHERE cveid = p_cveid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el cupo con cveid: %', p_cveid;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al cambiar el método de pago del cupo: %', SQLERRM;
END;
$$;

-- 5. Actualizar próximo pago del cupo vendido
CREATE OR REPLACE PROCEDURE quotas.pa_actualizar_prox_pago_cupo(
    p_cveid UUID,
    p_cveproxpago DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM quotas.cupovendido WHERE cveid = p_cveid AND cveestado = TRUE) THEN
        RAISE EXCEPTION 'El cupo no existe o está inactivo';
    END IF;

    UPDATE quotas.cupovendido
    SET cveproxpago = p_cveproxpago
    WHERE cveid = p_cveid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el cupo con cveid: %', p_cveid;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar próximo pago del cupo: %', SQLERRM;
END;
$$;

-- 6. Cambiar estado del cupo vendido
CREATE OR REPLACE PROCEDURE quotas.pa_cambiar_estado_cupo_vendido(
    p_cveid UUID,
    p_cveestado BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE quotas.cupovendido
    SET cveestado = p_cveestado
    WHERE cveid = p_cveid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el cupo con cveid: %', p_cveid;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al cambiar estado del cupo: %', SQLERRM;
END;
$$;
