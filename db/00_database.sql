-- Ejecutar este script conectado a la base postgres en pgAdmin
-- Termina conexiones abiertas a streemodb, la elimina y la crea de nuevo

-- IMPORTANTE (pgAdmin): asegúrate que Auto-commit esté EN (ON)
-- para que cada sentencia se ejecute fuera de un bloque de transacción.

-- 1) Cerrar sesiones activas contra la base objetivo
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'streemodb'
  AND pid <> pg_backend_pid();

-- 2) Dropear la base (requiere no estar dentro de una transacción)
DROP DATABASE IF EXISTS streemodb;

-- 3) Crear nuevamente la base
CREATE DATABASE streemodb;
