-- PROCEDIMIENTOS TARJETA
-- 1. Procedimiento para registrar tarjeta
CREATE OR REPLACE PROCEDURE pa_registrar_tarjeta(
    p_IdPersona UUID,
    p_Numero VARCHAR(19),
    p_Banco VARCHAR(50),
    p_Vencimiento VARCHAR(5)
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF NOT EXISTS (
        SELECT 1 FROM Persona
        WHERE IdPersona = p_IdPersona AND Estado = TRUE
    ) THEN
        RAISE EXCEPTION 'Persona inactiva o no encontrada: %', p_IdPersona;
    END IF;

    INSERT INTO Tarjeta (IdPersona, Numero, Banco, Vencimiento)
    VALUES (p_IdPersona, p_Numero, p_Banco, p_Vencimiento);

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al registrar tarjeta: %', SQLERRM;
END;
$$;

-- 2. Procedimiento para cambiar estado (habilitar/deshabilitar)
CREATE OR REPLACE PROCEDURE pa_cambiar_estado_tarjeta(
    p_IdTarjeta UUID,
    p_Estado BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN

    UPDATE Tarjeta
    SET Estado = p_Estado
    WHERE IdTarjeta = p_IdTarjeta;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró tarjeta con Id %', p_IdTarjeta;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al cambiar estado de la tarjeta: %', SQLERRM;
END;
$$;