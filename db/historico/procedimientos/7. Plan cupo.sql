-- PROCEDIMIENTOS PLAN CUPO
-- 1. Procedimiento para registrar plan cupo
CREATE OR REPLACE PROCEDURE pa_insertar_plan_cupo(
    p_TipoPlan VARCHAR(50),
    p_DuracionMes INT,
    p_Promo BOOLEAN,
    p_Precio NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN

    INSERT INTO PlanCupo (
        TipoPlan, DuracionMes, Promo, Precio
    )
    VALUES (
        p_TipoPlan, p_DuracionMes, p_Promo, p_Precio
    );

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al insertar el plan de cupo: %', SQLERRM;
END;
$$;

-- 2. Procedimiento para actualizar plan cupo
CREATE OR REPLACE PROCEDURE pa_actualizar_plan_cupo(
    p_IdPlanCupo UUID,
    p_TipoPlan VARCHAR(50),
    p_DuracionMes INT,
    p_Promo BOOLEAN,
    p_Precio NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF NOT EXISTS (
        SELECT 1 FROM PlanCupo WHERE IdPlanCupo = p_IdPlanCupo AND Estado = TRUE
    ) THEN
        RAISE EXCEPTION 'El plan de cupo no existe o está inactivo: %', p_IdPlanCupo;
    END IF;

    UPDATE PlanCupo
    SET
        TipoPlan = p_TipoPlan,
        DuracionMes = p_DuracionMes,
        Promo = p_Promo,
        Precio = p_Precio
    WHERE IdPlanCupo = p_IdPlanCupo;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar el plan de cupo: %', SQLERRM;
END;
$$;

-- 3. Procedimiento para cambiar estado (activar/inactivar el plan cupo)
CREATE OR REPLACE PROCEDURE pa_cambiar_estado_plan_cupo(
    p_IdPlanCupo UUID,
    p_Estado BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN

    UPDATE PlanCupo
    SET Estado = p_Estado
    WHERE IdPlanCupo = p_IdPlanCupo;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el plan de pago: %', p_IdPlanCupo;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al cambiar el estado del plan de cupo: %', SQLERRM;
END;
$$;