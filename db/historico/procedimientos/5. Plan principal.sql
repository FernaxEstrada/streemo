-- PROCEDIMIENTOS PLAN PRINCIPAL
-- 1. Procedimiento para registrar plan
CREATE OR REPLACE PROCEDURE pa_registrar_plan_principal(
    p_IdPersona UUID,
    p_NombrePlan VARCHAR(100),
    p_Correo VARCHAR(100),
    p_FechaInicio DATE,
    p_Costo NUMERIC(10,2),
    p_DireccionPlan VARCHAR(200),
    p_IdMetPago UUID,
    p_IdTarjeta UUID
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF NOT EXISTS (
        SELECT 1 FROM Persona WHERE IdPersona = p_IdPersona AND Estado = TRUE
    ) THEN
        RAISE EXCEPTION 'La persona no existe o está inactiva.';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM MetodoPago WHERE IdMetPago = p_IdMetPago AND Estado = TRUE
    ) THEN
        RAISE EXCEPTION 'Método de pago no válido o inactivo.';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM Tarjeta WHERE IdTarjeta = p_IdTarjeta AND Estado = TRUE
    ) THEN
        RAISE EXCEPTION 'Tarjeta inhabilitada o no encontrada.';
    END IF;

    INSERT INTO PlanPrincipal (
        IdPersona, NombrePlan, Correo, FechaInicio, Costo,
        DireccionPlan, IdMetPago, IdTarjeta
    ) VALUES (
        p_IdPersona, p_NombrePlan, p_Correo, p_FechaInicio, p_Costo,
        p_DireccionPlan, p_IdMetPago, p_IdTarjeta
    );

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al registrar el plan principal: %', SQLERRM;
END;
$$;

-- 2. Procedimiento para actualizar datos basicos del plan
CREATE OR REPLACE PROCEDURE pa_actualizar_datos_basicos_plan(
    p_IdPlanP UUID,
    p_NombrePlan VARCHAR(100),
    p_Correo VARCHAR(100),
    p_Costo NUMERIC(10,2),
    p_DireccionPlan VARCHAR(200)
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF NOT EXISTS (
        SELECT 1 FROM PlanPrincipal WHERE IdPlanP = p_IdPlanP AND Estado = TRUE
    ) THEN
        RAISE EXCEPTION 'El plan no está activo o no existe: %', p_IdPlanP;
    END IF;

    UPDATE PlanPrincipal
    SET NombrePlan = p_NombrePlan,
        Correo = p_Correo,
        Costo = p_Costo,
        DireccionPlan = p_DireccionPlan
    WHERE IdPlanP = p_IdPlanP;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el plan con ID: %', p_IdPlanP;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar datos básicos del plan: %', SQLERRM;
END;
$$;

-- 3. Procedimiento para cambiar el metodo de pago del plan
CREATE OR REPLACE PROCEDURE pa_cambiar_metodo_pago_plan(
    p_IdPlanP UUID,
    p_IdMetPago UUID
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF NOT EXISTS (
        SELECT 1 FROM PlanPrincipal WHERE IdPlanP = p_IdPlanP AND Estado = TRUE
    ) THEN
        RAISE EXCEPTION 'El plan no está activo o no existe: %', p_IdPlanP;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM MetodoPago WHERE IdMetPago = p_IdMetPago AND Estado = TRUE
    ) THEN
        RAISE EXCEPTION 'Método de pago no válido o inactivo.';
    END IF;

    UPDATE PlanPrincipal
    SET IdMetPago = p_IdMetPago
    WHERE IdPlanP = p_IdPlanP;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el plan con ID: %', p_IdPlanP;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al cambiar método de pago: %', SQLERRM;
END;
$$;

-- 4. Procedimiento para cambiar tarjeta del plan
CREATE OR REPLACE PROCEDURE pa_cambiar_tarjeta_plan(
    p_IdPlanP UUID,
    p_IdTarjeta UUID
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF NOT EXISTS (
        SELECT 1 FROM PlanPrincipal WHERE IdPlanP = p_IdPlanP AND Estado = TRUE
    ) THEN
        RAISE EXCEPTION 'El plan no está activo o no existe: %', p_IdPlanP;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM Tarjeta WHERE IdTarjeta = p_IdTarjeta AND Estado = TRUE
    ) THEN
        RAISE EXCEPTION 'Tarjeta no válida o inactiva.';
    END IF;

    UPDATE PlanPrincipal
    SET IdTarjeta = p_IdTarjeta
    WHERE IdPlanP = p_IdPlanP;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el plan con ID: %', p_IdPlanP;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al cambiar tarjeta del plan: %', SQLERRM;
END;
$$;

-- 5. Procedimiento para actualizar proxima fecha de pago
CREATE OR REPLACE PROCEDURE pa_actualizar_prox_pago_plan(
    p_IdPlanP UUID,
    p_ProxPago DATE
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF NOT EXISTS (
        SELECT 1 FROM PlanPrincipal WHERE IdPlanP = p_IdPlanP AND Estado = TRUE
    ) THEN
        RAISE EXCEPTION 'El plan no está activo o no existe: %', p_IdPlanP;
    END IF;

    UPDATE PlanPrincipal
    SET ProxPago = p_ProxPago
    WHERE IdPlanP = p_IdPlanP;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el plan con ID: %', p_IdPlanP;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar próxima fecha de pago: %', SQLERRM;
END;
$$;

-- 6. Procedimiento para cambiar estado (habilitar/deshabilitar)
CREATE OR REPLACE PROCEDURE pa_cambiar_estado_plan_principal(
    p_IdPlanP UUID,
    p_Estado BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN

    UPDATE PlanPrincipal
    SET Estado = p_Estado
    WHERE IdPlanP = p_IdPlanP;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el plan para actualizar: %', p_IdPlanP;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al cambiar el estado del plan principal: %', SQLERRM;
END;
$$;