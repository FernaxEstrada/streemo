-- SCHEMA: plans
-- Planes principales y planes de cupos

-- 1. Registrar plan principal
CREATE OR REPLACE PROCEDURE plans.pa_registrar_plan_principal(
    p_priidpersona UUID,
    p_prinombre VARCHAR(100),
    p_pricorreo VARCHAR(100),
    p_prifechainicio DATE,
    p_pricosto NUMERIC(10,2),
    p_pridireccion VARCHAR(200),
    p_priidmetpago UUID,
    p_priidtarjeta UUID
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM auth.persona WHERE perid = p_priidpersona AND perestado = TRUE) THEN
        RAISE EXCEPTION 'La persona no existe o está inactiva';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM payments.metodopago WHERE mtpid = p_priidmetpago AND mtpestado = TRUE) THEN
        RAISE EXCEPTION 'Método de pago no válido o inactivo';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM payments.tarjeta WHERE tarid = p_priidtarjeta AND tarestado = TRUE) THEN
        RAISE EXCEPTION 'Tarjeta inhabilitada o no encontrada';
    END IF;

    INSERT INTO plans.planprincipal (
        priidpersona, prinombre, pricorreo, prifechainicio, pricosto,
        pridireccion, priidmetpago, priidtarjeta
    ) VALUES (
        p_priidpersona, p_prinombre, p_pricorreo, p_prifechainicio, p_pricosto,
        p_pridireccion, p_priidmetpago, p_priidtarjeta
    );
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al registrar el plan principal: %', SQLERRM;
END;
$$;

-- 2. Actualizar datos básicos del plan
CREATE OR REPLACE PROCEDURE plans.pa_actualizar_datos_basicos_plan(
    p_priid UUID,
    p_prinombre VARCHAR(100),
    p_pricorreo VARCHAR(100),
    p_pricosto NUMERIC(10,2),
    p_pridireccion VARCHAR(200)
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM plans.planprincipal WHERE priid = p_priid AND priestado = TRUE) THEN
        RAISE EXCEPTION 'El plan no está activo o no existe';
    END IF;

    UPDATE plans.planprincipal
    SET prinombre = p_prinombre,
        pricorreo = p_pricorreo,
        pricosto = p_pricosto,
        pridireccion = p_pridireccion
    WHERE priid = p_priid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el plan con priid: %', p_priid;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar datos básicos del plan: %', SQLERRM;
END;
$$;

-- 3. Cambiar método de pago del plan
CREATE OR REPLACE PROCEDURE plans.pa_cambiar_metodo_pago_plan(
    p_priid UUID,
    p_priidmetpago UUID
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM plans.planprincipal WHERE priid = p_priid AND priestado = TRUE) THEN
        RAISE EXCEPTION 'El plan no está activo o no existe';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM payments.metodopago WHERE mtpid = p_priidmetpago AND mtpestado = TRUE) THEN
        RAISE EXCEPTION 'Método de pago no válido o inactivo';
    END IF;

    UPDATE plans.planprincipal
    SET priidmetpago = p_priidmetpago
    WHERE priid = p_priid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el plan con priid: %', p_priid;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al cambiar método de pago: %', SQLERRM;
END;
$$;

-- 4. Cambiar tarjeta del plan
CREATE OR REPLACE PROCEDURE plans.pa_cambiar_tarjeta_plan(
    p_priid UUID,
    p_priidtarjeta UUID
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM plans.planprincipal WHERE priid = p_priid AND priestado = TRUE) THEN
        RAISE EXCEPTION 'El plan no está activo o no existe';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM payments.tarjeta WHERE tarid = p_priidtarjeta AND tarestado = TRUE) THEN
        RAISE EXCEPTION 'Tarjeta no válida o inactiva';
    END IF;

    UPDATE plans.planprincipal
    SET priidtarjeta = p_priidtarjeta
    WHERE priid = p_priid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el plan con priid: %', p_priid;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al cambiar tarjeta del plan: %', SQLERRM;
END;
$$;

-- 5. Actualizar próxima fecha de pago del plan
CREATE OR REPLACE PROCEDURE plans.pa_actualizar_prox_pago_plan(
    p_priid UUID,
    p_priproxpago DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM plans.planprincipal WHERE priid = p_priid AND priestado = TRUE) THEN
        RAISE EXCEPTION 'El plan no está activo o no existe';
    END IF;

    UPDATE plans.planprincipal
    SET priproxpago = p_priproxpago
    WHERE priid = p_priid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el plan con priid: %', p_priid;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar próxima fecha de pago: %', SQLERRM;
END;
$$;

-- 6. Cambiar estado del plan principal
CREATE OR REPLACE PROCEDURE plans.pa_cambiar_estado_plan_principal(
    p_priid UUID,
    p_priestado BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE plans.planprincipal
    SET priestado = p_priestado
    WHERE priid = p_priid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el plan para actualizar: %', p_priid;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al cambiar el estado del plan principal: %', SQLERRM;
END;
$$;

-- 7. Insertar plan cupo
CREATE OR REPLACE PROCEDURE plans.pa_insertar_plan_cupo(
    p_cupnombre VARCHAR(50),
    p_cupduracionmeses INT,
    p_cuppromocion BOOLEAN,
    p_cupprecio NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO plans.plancupo (
        cupnombre, cupduracionmeses, cuppromocion, cupprecio
    )
    VALUES (
        p_cupnombre, p_cupduracionmeses, p_cuppromocion, p_cupprecio
    );
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al insertar el plan de cupo: %', SQLERRM;
END;
$$;

-- 8. Actualizar plan cupo
CREATE OR REPLACE PROCEDURE plans.pa_actualizar_plan_cupo(
    p_cupid UUID,
    p_cupnombre VARCHAR(50),
    p_cupduracionmeses INT,
    p_cuppromocion BOOLEAN,
    p_cupprecio NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM plans.plancupo WHERE cupid = p_cupid AND cupestado = TRUE) THEN
        RAISE EXCEPTION 'El plan de cupo no existe o está inactivo';
    END IF;

    UPDATE plans.plancupo
    SET
        cupnombre = p_cupnombre,
        cupduracionmeses = p_cupduracionmeses,
        cuppromocion = p_cuppromocion,
        cupprecio = p_cupprecio
    WHERE cupid = p_cupid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el plan de cupo con cupid: %', p_cupid;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar el plan de cupo: %', SQLERRM;
END;
$$;

-- 9. Cambiar estado del plan cupo
CREATE OR REPLACE PROCEDURE plans.pa_cambiar_estado_plan_cupo(
    p_cupid UUID,
    p_cupestado BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE plans.plancupo
    SET cupestado = p_cupestado
    WHERE cupid = p_cupid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el plan de cupo con cupid: %', p_cupid;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al cambiar el estado del plan de cupo: %', SQLERRM;
END;
$$;
