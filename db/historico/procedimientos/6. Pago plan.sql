-- PROCEDIMIENTOS PAGO PLAN
-- 1. Procedimiento para registrar pago plan
CREATE OR REPLACE PROCEDURE pa_insertar_pago_plan(
    p_IdPlanP UUID,
    p_FechaPago TIMESTAMP,
    p_Nota VARCHAR(200)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_ProxPago DATE;
    v_Costo NUMERIC(10,2);
    v_MetodoPagoNombre VARCHAR(100);
    v_TarjetaResumen VARCHAR(50);
    v_NuevoProxPago DATE;
BEGIN

    IF NOT EXISTS (
        SELECT 1 FROM PlanPrincipal WHERE IdPlanP = p_IdPlanP AND Estado = TRUE
    ) THEN
        RAISE EXCEPTION 'El plan no está activo o no existe: %', p_IdPlanP;
    END IF;

    SELECT 
        COALESCE(pp.ProxPago, pp.FechaInicio), 
        pp.Costo, 
        mp.Nombre,
        CONCAT(t.Banco, ' ****', RIGHT(t.Numero, 4))
    INTO 
        v_ProxPago, 
        v_Costo, 
        v_MetodoPagoNombre, 
        v_TarjetaResumen
    FROM PlanPrincipal pp
    JOIN MetodoPago mp ON mp.IdMetPago = pp.IdMetPago AND mp.Estado = TRUE
    JOIN Tarjeta t ON t.IdTarjeta = pp.IdTarjeta AND t.Estado = TRUE
    WHERE pp.IdPlanP = p_IdPlanP;

    INSERT INTO PagoPlan (
        IdPlanP, FechaFacturacion, FechaPago, Monto, MetodoPago, Tarjeta, Nota
    )
    VALUES (
        p_IdPlanP, v_ProxPago, p_FechaPago, v_Costo, v_MetodoPagoNombre, v_TarjetaResumen, p_Nota
    );

    v_NuevoProxPago := v_ProxPago + INTERVAL '1 month';
    CALL pa_actualizar_prox_pago_plan(p_IdPlanP, v_NuevoProxPago);

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al insertar el pago del plan: %', SQLERRM;
END;
$$;

-- 2. Procedimiento para actualizar solo la nota del pago
CREATE OR REPLACE PROCEDURE pa_actualizar_nota_pago_plan(
    p_IdPagoPlan UUID,
    p_Nota VARCHAR(200)
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF NOT EXISTS (
        SELECT 1 FROM PagoPlan WHERE IdPagoPlan = p_IdPagoPlan AND Estado = TRUE
    ) THEN
        RAISE EXCEPTION 'El pago no existe o está inactivo: %', p_IdPagoPlan;
    END IF;

    UPDATE PagoPlan
    SET Nota = p_Nota
    WHERE IdPagoPlan = p_IdPagoPlan;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar la nota del pago: %', SQLERRM;
END;
$$;

-- 3. Procedimiento para cambiar estado (activar/inactivar el pago)
CREATE OR REPLACE PROCEDURE pa_cambiar_estado_pago_plan(
    p_IdPagoPlan UUID,
    p_Estado BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN

    UPDATE PagoPlan
    SET Estado = p_Estado
    WHERE IdPagoPlan = p_IdPagoPlan;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el pago: %', p_IdPagoPlan;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al cambiar el estado del pago: %', SQLERRM;
END;
$$;