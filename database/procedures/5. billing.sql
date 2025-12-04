-- SCHEMA: billing
-- Pagos de planes principales y cupos

-- 1. Insertar pago de plan principal
CREATE OR REPLACE PROCEDURE billing.pa_insertar_pago_planp(
    p_pgpidplanp UUID,
    p_pgpfechapago TIMESTAMP,
    p_pgpnota VARCHAR(200)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_pgpfechafacturacion DATE;
    v_pgpmonto NUMERIC(10,2);
    v_pgpmetodopago VARCHAR(50);
    v_pgptarjeta VARCHAR(50);
    v_priproxpago DATE;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM plans.planprincipal WHERE priid = p_pgpidplanp AND priestado = TRUE) THEN
        RAISE EXCEPTION 'El plan no está activo o no existe';
    END IF;

    SELECT 
        COALESCE(pp.priproxpago, pp.prifechainicio), 
        pp.pricosto, 
        mp.mtpnombre,
        CONCAT(t.tarbanco, ' ****', RIGHT(t.tarnumero, 4))
    INTO 
        v_pgpfechafacturacion, 
        v_pgpmonto, 
        v_pgpmetodopago, 
        v_pgptarjeta
    FROM plans.planprincipal pp
    JOIN payments.metodopago mp ON mp.mtpid = pp.priidmetpago AND mp.mtpestado = TRUE
    JOIN payments.tarjeta t ON t.tarid = pp.priidtarjeta AND t.tarestado = TRUE
    WHERE pp.priid = p_pgpidplanp;

    INSERT INTO billing.pagoplanp (
        pgpidplanp, pgpfechafacturacion, pgpfechapago, pgpmonto, pgpmetodopago, pgptarjeta, pgpnota
    )
    VALUES (
        p_pgpidplanp, v_pgpfechafacturacion, p_pgpfechapago, v_pgpmonto, v_pgpmetodopago, v_pgptarjeta, p_pgpnota
    );

    v_priproxpago := v_pgpfechafacturacion + INTERVAL '1 month';
    CALL plans.pa_actualizar_prox_pago_plan(p_pgpidplanp, v_priproxpago);

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al insertar el pago del plan: %', SQLERRM;
END;
$$;

-- 2. Actualizar nota del pago de plan principal
CREATE OR REPLACE PROCEDURE billing.pa_actualizar_nota_pago_planp(
    p_pgpid UUID,
    p_pgpnota VARCHAR(200)
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM billing.pagoplanp WHERE pgpid = p_pgpid AND pgpestado = TRUE) THEN
        RAISE EXCEPTION 'El pago no existe o está inactivo';
    END IF;

    UPDATE billing.pagoplanp
    SET pgpnota = p_pgpnota
    WHERE pgpid = p_pgpid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el pago con pgpid: %', p_pgpid;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar la nota del pago: %', SQLERRM;
END;
$$;

-- 3. Cambiar estado del pago de plan principal
CREATE OR REPLACE PROCEDURE billing.pa_cambiar_estado_pago_planp(
    p_pgpid UUID,
    p_pgpestado BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE billing.pagoplanp
    SET pgpestado = p_pgpestado
    WHERE pgpid = p_pgpid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el pago con pgpid: %', p_pgpid;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al cambiar el estado del pago: %', SQLERRM;
END;
$$;

-- 4. Insertar pago de cupo
CREATE OR REPLACE PROCEDURE billing.pa_insertar_pago_cupo(
    p_pgcidcupovendido UUID,
    p_pgcfechapago TIMESTAMP,
    p_pgcnota VARCHAR(200)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_pgcfechafacturacion DATE;
    v_pgcmetodopago VARCHAR(100);
    v_pgcmonto NUMERIC(10,2);
    v_pgcmesespagados INT;
    v_cveproxpago DATE;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM quotas.cupovendido WHERE cveid = p_pgcidcupovendido AND cveestado = TRUE) THEN
        RAISE EXCEPTION 'El cupo no está activo o no existe';
    END IF;

    SELECT 
        COALESCE(cv.cveproxpago, cv.cvefechainicio), 
        mp.mtpnombre,
        pc.cupprecio,
        pc.cupduracionmeses
    INTO 
        v_pgcfechafacturacion,
        v_pgcmetodopago,
        v_pgcmonto,
        v_pgcmesespagados
    FROM quotas.cupovendido cv
    JOIN payments.metodopago mp ON mp.mtpid = cv.cveidmetpago AND mp.mtpestado = TRUE
    JOIN plans.plancupo pc ON pc.cupid = cv.cveidplancupo AND pc.cupestado = TRUE
    WHERE cv.cveid = p_pgcidcupovendido;

    INSERT INTO billing.pagocupo (
        pgcidcupovendido, pgcmetodopago, pgcfechafacturacion, pgcfechapago, 
        pgcmesespagados, pgcmonto, pgcnota
    )
    VALUES (
        p_pgcidcupovendido, v_pgcmetodopago, v_pgcfechafacturacion, p_pgcfechapago, 
        v_pgcmesespagados, v_pgcmonto, p_pgcnota
    );

    v_cveproxpago := v_pgcfechafacturacion + (INTERVAL '1 month' * v_pgcmesespagados);
    CALL quotas.pa_actualizar_prox_pago_cupo(p_pgcidcupovendido, v_cveproxpago);

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al insertar el pago del cupo: %', SQLERRM;
END;
$$;

-- 5. Actualizar nota del pago de cupo
CREATE OR REPLACE PROCEDURE billing.pa_actualizar_nota_pago_cupo(
    p_pgcid UUID,
    p_pgcnota VARCHAR(200)
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM billing.pagocupo WHERE pgcid = p_pgcid) THEN
        RAISE EXCEPTION 'El pago de cupo no existe';
    END IF;

    UPDATE billing.pagocupo
    SET pgcnota = p_pgcnota
    WHERE pgcid = p_pgcid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el pago con pgcid: %', p_pgcid;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar la nota del pago de cupo: %', SQLERRM;
END;
$$;

-- 6. Cambiar estado del pago de cupo
CREATE OR REPLACE PROCEDURE billing.pa_cambiar_estado_pago_cupo(
    p_pgcid UUID,
    p_pgcestado BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE billing.pagocupo
    SET pgcestado = p_pgcestado
    WHERE pgcid = p_pgcid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el pago con pgcid: %', p_pgcid;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar el estado del pago de cupo: %', SQLERRM;
END;
$$;
