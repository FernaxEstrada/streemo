-- BASE DE DATOS PARA STREEMO
-- Gestion de pagos y subscripciones de planes y cupos de streaming 

-- CREAR BASE DE DATOS
CREATE DATABASE streemodbV2;

-- EXTENSIONES
-- HABILITACION DE LA EXTENSION PGCRYPTO PARA GENERAR UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ESQUEMAS
-- Gestión de identidad y autenticación
CREATE SCHEMA IF NOT EXISTS auth;

-- Planes principales y planes de cupos
CREATE SCHEMA IF NOT EXISTS plans;

-- Métodos de pago y tarjetas
CREATE SCHEMA IF NOT EXISTS payments;

-- Venta de cupos
CREATE SCHEMA IF NOT EXISTS quotas;

-- Pagos de planes principales y cupos
CREATE SCHEMA IF NOT EXISTS billing;

