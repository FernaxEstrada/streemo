-- Ejecutar este script conectado a la base streemodb en pgAdmin
-- Consolida procedimientos en orden de dependencias
-- Orden: Persona -> Usuario -> MetodoPago -> Tarjeta -> PlanPrincipal -> PagoPlan -> PlanCupo -> CupoVendido -> PagoCupo

-- PERSONA
-- =============================================
-- PROCEDIMIENTOS PERSONA
-- 1. Procedimiento para registrar persona
CREATE OR REPLACE PROCEDURE pa_registrar_persona(
    p_Nombres VARCHAR(100),
    p_Apellidos VARCHAR(100),
    p_Telefono VARCHAR(15),
    p_Sexo CHAR(1),
    p_TipoAP BOOLEAN,
    p_TipoC BOOLEAN,
    p_TipoSA BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN

    INSERT INTO Persona (
        Nombres, Apellidos, Telefono, Sexo,
        TipoAP, TipoC, TipoSA
    )
    VALUES (
        p_Nombres, p_Apellidos, p_Telefono, p_Sexo,
        p_TipoAP, p_TipoC, p_TipoSA
    );

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al registrar persona: %', SQLERRM;
END;
$$;

-- 2. Procedimiento para actualizar datos personales
CREATE OR REPLACE PROCEDURE pa_actualizar_datos_persona(
    p_IdPersona UUID,
    p_Nombres VARCHAR(100),
    p_Apellidos VARCHAR(100),
    p_Telefono VARCHAR(15),
    p_Sexo CHAR(1)
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF EXISTS (
        SELECT 1 FROM Persona
        WHERE IdPersona = p_IdPersona AND Estado = FALSE
    ) THEN
        RAISE EXCEPTION 'Persona inhabilitada. No se puede modificar.';
    END IF;

    UPDATE Persona
    SET
        Nombres = p_Nombres,
        Apellidos = p_Apellidos,
        Telefono = p_Telefono,
        Sexo = p_Sexo
    WHERE IdPersona = p_IdPersona;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró la persona con IdPersona %', p_IdPersona;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar datos personales: %', SQLERRM;
END;
$$;

-- 3. Procedimiento para actualizar roles
CREATE OR REPLACE PROCEDURE pa_actualizar_roles_persona(
    p_IdPersona UUID,
    p_TipoAP BOOLEAN,
    p_TipoC BOOLEAN,
    p_TipoSA BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF EXISTS (
        SELECT 1 FROM Persona
        WHERE IdPersona = p_IdPersona AND Estado = FALSE
    ) THEN
        RAISE EXCEPTION 'Persona inhabilitada. No se puede modificar.';
    END IF;

    UPDATE Persona
    SET
        TipoAP = p_TipoAP,
        TipoC = p_TipoC,
        TipoSA = p_TipoSA
    WHERE IdPersona = p_IdPersona;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró la persona con IdPersona %', p_IdPersona;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar roles: %', SQLERRM;
END;
$$;

-- 4. Procedimiento para cambiar estado (habilitar/deshabilitar)
CREATE OR REPLACE PROCEDURE pa_cambiar_estado_persona(
    p_IdPersona UUID,
    p_Estado BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN

    UPDATE Persona
    SET Estado = p_Estado
    WHERE IdPersona = p_IdPersona;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró la persona con IdPersona %', p_IdPersona;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al cambiar el estado: %', SQLERRM;
END;
$$;


-- USUARIO
-- =============================================
-- 1. Procedimiento para crear usuario
CREATE OR REPLACE PROCEDURE pa_crear_usuario(
    p_IdPersona UUID,
    p_Usuario VARCHAR(100),
    p_Contrasena VARCHAR(60)
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF NOT EXISTS (SELECT 1 FROM Persona WHERE IdPersona = p_IdPersona) THEN
        RAISE EXCEPTION 'No existe la persona con Id %', p_IdPersona;
    END IF;

    INSERT INTO Usuario (
        IdPersona, Usuario, Contrasena
    )
    VALUES (
        p_IdPersona, p_Usuario, p_Contrasena
    );

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al crear usuario: %', SQLERRM;
END;
$$;

-- 2. Procedimiento para actualizar nombre de usuario
CREATE OR REPLACE PROCEDURE pa_actualizar_usuario(
    p_IdPersona UUID,
    p_NuevoUsuario VARCHAR(100)
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF EXISTS (
        SELECT 1 FROM Usuario
        WHERE IdPersona = p_IdPersona AND Estado = FALSE
    ) THEN
        RAISE EXCEPTION 'Usuario inhabilitado. No se puede modificar.';
    END IF;

    UPDATE Usuario
    SET Usuario = p_NuevoUsuario
    WHERE IdPersona = p_IdPersona;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró usuario con IdPersona %', p_IdPersona;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar usuario: %', SQLERRM;
END;
$$;

-- 3. Procedimiento para actualizar contraseña
CREATE OR REPLACE PROCEDURE pa_actualizar_contrasena(
    p_IdPersona UUID,
    p_NuevaContrasena VARCHAR(60)
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF EXISTS (
        SELECT 1 FROM Usuario
        WHERE IdPersona = p_IdPersona AND Estado = FALSE
    ) THEN
        RAISE EXCEPTION 'Usuario inhabilitado. No se puede modificar.';
    END IF;

    UPDATE Usuario
    SET Contrasena = p_NuevaContrasena
    WHERE IdPersona = p_IdPersona;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró usuario con IdPersona %', p_IdPersona;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar contraseña: %', SQLERRM;
END;
$$;

-- 4. Procedimiento para cambiar estado del usuario (habilitar/deshabilitar)
CREATE OR REPLACE PROCEDURE pa_cambiar_estado_usuario(
    p_IdPersona UUID,
    p_Estado BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN

    UPDATE Usuario
    SET Estado = p_Estado
    WHERE IdPersona = p_IdPersona;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró usuario con IdPersona %', p_IdPersona;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al cambiar el estado del usuario: %', SQLERRM;
END;
$$;


-- METODO DE PAGO
-- =============================================
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


-- TARJETA
-- =============================================
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


-- PLAN PRINCIPAL
-- =============================================
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


-- PAGO PLAN
-- =============================================
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


-- PLAN CUPO
-- =============================================
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


-- CUPO VENDIDO
-- =============================================
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


-- PAGO CUPO
-- =============================================
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
