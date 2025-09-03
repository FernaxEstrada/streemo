-- PROCEDIMIENTOS METODO DE PAGO
-- 1. Procedimiento para crear metodo de pago
CREATE OR REPLACE PROCEDURE pa_crear_metodo_pago(
    p_Nombre VARCHAR(100)
)
LANGUAGE plpgsql
AS $$
BEGIN

    INSERT INTO MetodoPago (Nombre)
    VALUES (p_Nombre);

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al crear método de pago: %', SQLERRM;
END;
$$;

-- 2. Procedimiento para actualizar nombre
CREATE OR REPLACE PROCEDURE pa_actualizar_metodo_pago(
    p_IdMetPago UUID,
    p_NuevoNombre VARCHAR(100)
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF EXISTS (
        SELECT 1 FROM MetodoPago
        WHERE IdMetPago = p_IdMetPago AND Estado = FALSE
    ) THEN
        RAISE EXCEPTION 'Método de pago inhabilitado. No se puede modificar.';
    END IF;

    UPDATE MetodoPago
    SET Nombre = p_NuevoNombre
    WHERE IdMetPago = p_IdMetPago;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró método de pago con Id %', p_IdMetPago;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar método de pago: %', SQLERRM;
END;
$$;

-- 3. Procedimiento para cambiar estado (habilitar/deshabilitar)
CREATE OR REPLACE PROCEDURE pa_cambiar_estado_metodo_pago(
    p_IdMetPago UUID,
    p_Estado BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN

    UPDATE MetodoPago
    SET Estado = p_Estado
    WHERE IdMetPago = p_IdMetPago;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró método de pago con Id %', p_IdMetPago;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al cambiar estado del método de pago: %', SQLERRM;
END;
$$;