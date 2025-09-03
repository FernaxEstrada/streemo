-- PROCEDIMIENTOS CUPO VENDIDO
-- 1. Procedimiento para registrar un cupo vendido
CREATE OR REPLACE PROCEDURE pa_insertar_cupo_vendido(
    p_IdPersona UUID,
    p_IdPlanP UUID,
    p_IdPlanCupo UUID,
    p_IdMetPago UUID,
    p_Usuario VARCHAR(100),
    p_FechaInicio DATE,
    p_Nota VARCHAR(200)
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF NOT EXISTS (SELECT 1 FROM Persona WHERE IdPersona = p_IdPersona AND Estado = TRUE) THEN
        RAISE EXCEPTION 'La persona no está activa o no existe';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM PlanPrincipal WHERE IdPlanP = p_IdPlanP AND Estado = TRUE) THEN
        RAISE EXCEPTION 'El plan principal no está activo o no existe';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM PlanCupo WHERE IdPlanCupo = p_IdPlanCupo AND Estado = TRUE) THEN
        RAISE EXCEPTION 'El plan del cupo no está activo o no existe';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM MetodoPago WHERE IdMetPago = p_IdMetPago AND Estado = TRUE) THEN
        RAISE EXCEPTION 'El metodo de pago no está activo o no existe';
    END IF;

    INSERT INTO CupoVendido (
        IdPersona, IdPlanP, IdPlanCupo, IdMetPago,
        Usuario, FechaInicio, Nota
    )
    VALUES (
        p_IdPersona, p_IdPlanP, p_IdPlanCupo, p_IdMetPago,
        p_Usuario, p_FechaInicio, p_Nota
    );

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al insertar el cupo: %', SQLERRM;
END;
$$;

-- 2. Procedimiento para actualizar datos generales
CREATE OR REPLACE PROCEDURE pa_actualizar_datos_cupo_vendido(
    p_IdCupo UUID,
    p_Usuario VARCHAR(100),
    p_Nota VARCHAR(200)
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF NOT EXISTS (
        SELECT 1 FROM CupoVendido WHERE IdCupo = p_IdCupo AND Estado = TRUE
    ) THEN
        RAISE EXCEPTION 'El cupo no existe o está inactivo';
    END IF;

    UPDATE CupoVendido
    SET
        Usuario = p_Usuario,
        Nota = p_Nota
    WHERE IdCupo = p_IdCupo;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar datos del cupo: %', SQLERRM;
END;
$$;

-- 3. Procedimiento para cambiar plan del cupo
CREATE OR REPLACE PROCEDURE pa_cambiar_plan_cupo_vendido(
    p_IdCupo UUID,
    p_IdNuevoPlanCupo UUID
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF NOT EXISTS (
        SELECT 1 FROM CupoVendido WHERE IdCupo = p_IdCupo AND Estado = TRUE
    ) THEN
        RAISE EXCEPTION 'El cupo no existe o está inactivo';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM PlanCupo WHERE IdPlanCupo = p_IdNuevoPlanCupo AND Estado = TRUE
    ) THEN
        RAISE EXCEPTION 'El nuevo plan está inactivo o no existe';
    END IF;

    UPDATE CupoVendido
    SET IdPlanCupo = p_IdNuevoPlanCupo
    WHERE IdCupo = p_IdCupo;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al cambiar el plan del cupo: %', SQLERRM;
END;
$$;

-- 4. Procedimiento para cambiar el metodo de pago
CREATE OR REPLACE PROCEDURE pa_cambiar_metodo_pago_cupo_vendido(
    p_IdCupo UUID,
    p_IdMetPago UUID
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF NOT EXISTS (
        SELECT 1 FROM CupoVendido WHERE IdCupo = p_IdCupo AND Estado = TRUE
    ) THEN
        RAISE EXCEPTION 'El cupo no existe o está inactivo';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM MetodoPago WHERE IdMetPago = p_IdMetPago AND Estado = TRUE
    ) THEN
        RAISE EXCEPTION 'Método de pago no válido o inactivo.';
    END IF;

    UPDATE CupoVendido
    SET IdMetPago = p_IdMetPago
    WHERE IdCupo = p_IdCupo;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al cambiar el metodo de pago del cupo: %', SQLERRM;
END;
$$;

-- 5. Procedimiento para actualizar el proximo pago del cupo
CREATE OR REPLACE PROCEDURE pa_actualizar_prox_pago_cupo(
    p_IdCupo UUID,
    p_ProxPago DATE
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF NOT EXISTS (
        SELECT 1 FROM CupoVendido WHERE IdCupo = p_IdCupo AND Estado = TRUE
    ) THEN
        RAISE EXCEPTION 'El cupo no existe o está inactivo';
    END IF;

    UPDATE CupoVendido
    SET ProxPago = p_ProxPago
    WHERE IdCupo = p_IdCupo;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar próximo pago del cupo: %', SQLERRM;
END;
$$;

-- 6. Procedimiento para cambiar estado (activar/inactivar el cupo vendido)
CREATE OR REPLACE PROCEDURE pa_cambiar_estado_cupo_vendido(
    p_IdCupo UUID,
    p_Estado BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN

    UPDATE CupoVendido
    SET Estado = p_Estado
    WHERE IdCupo = p_IdCupo;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el cupo: %', p_IdCupo;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al cambiar estado del cupo: %', SQLERRM;
END;
$$;