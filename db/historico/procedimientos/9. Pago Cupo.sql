-- PROCEDIMIENTOS PAGO CUPO
-- 1. Procedimiento para registrar pago cupo
CREATE OR REPLACE PROCEDURE pa_insertar_pago_cupo(
    p_IdCupo UUID,
    p_FechaPago TIMESTAMP,
    p_Nota VARCHAR(200)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_ProxPago DATE;
    v_MetodoPagoNombre VARCHAR(100);
    v_Monto NUMERIC(10,2);
    v_MesesPagados INT;
    v_NuevoProxPago DATE;
BEGIN

    IF NOT EXISTS (
        SELECT 1 FROM CupoVendido WHERE IdCupo = p_IdCupo AND Estado = TRUE
    ) THEN
        RAISE EXCEPTION 'El cupo no está activo o no existe: %', p_IdCupo;
    END IF;

    SELECT 
        COALESCE(cv.ProxPago, cv.FechaInicio), 
        mp.Nombre,
        pc.Precio,
        pc.DuracionMes
    INTO 
        v_ProxPago,
        v_MetodoPagoNombre,
        v_Monto,
        v_MesesPagados
    FROM CupoVendido cv
    JOIN MetodoPago mp ON mp.IdMetPago = cv.IdMetPago AND mp.Estado = TRUE
    JOIN PlanCupo pc ON pc.IdPlanCupo = cv.IdPlanCupo AND pc.Estado = TRUE
    WHERE cv.IdCupo = p_IdCupo;

    INSERT INTO PagoCupo (
        IdCupo, MetodoPago, FechaFacturacion, FechaPago, 
        MesesPagados, Monto, Nota
    )
    VALUES (
        p_IdCupo, v_MetodoPagoNombre, v_ProxPago, p_FechaPago, 
        v_MesesPagados, v_Monto, p_Nota
    );

    v_NuevoProxPago := v_ProxPago + (INTERVAL '1 month' * v_MesesPagados);
    CALL pa_actualizar_prox_pago_cupo(p_IdCupo, v_NuevoProxPago);

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al insertar el pago del cupo: %', SQLERRM;
END;
$$;

-- 2. Procedimiento para actualizar solo la nota de pago del cupo
CREATE OR REPLACE PROCEDURE pa_actualizar_nota_pago_cupo(
    p_IdPagoCupo UUID,
    p_Nota VARCHAR(200)
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF NOT EXISTS (
        SELECT 1 FROM PagoCupo WHERE IdPagoCupo = p_IdPagoCupo
    ) THEN
        RAISE EXCEPTION 'El pago de cupo no existe: %', p_IdPagoCupo;
    END IF;

    UPDATE PagoCupo
    SET Nota = p_Nota
    WHERE IdPagoCupo = p_IdPagoCupo;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar la nota del pago de cupo: %', SQLERRM;
END;
$$;

-- 3. Procedimiento para cambiar estado (activar/inactivar el pago del cupo)
CREATE OR REPLACE PROCEDURE pa_actualizar_estado_pago_cupo(
    p_IdPagoCupo UUID,
    p_Estado BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN

    UPDATE PagoCupo
    SET Estado = p_Estado
    WHERE IdPagoCupo = p_IdPagoCupo;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'El pago de cupo no existe: %', p_IdPagoCupo;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar el estado del pago de cupo: %', SQLERRM;
END;
$$;