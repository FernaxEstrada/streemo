# Streemo DB - Setup en pgAdmin

Este folder contiene scripts SQL preparados para ejecutarse en pgAdmin en dos fases: creación de base y creación de esquema/roles/seed. Opcionalmente, puedes cargar procedimientos.

## Orden de ejecución
1) 00_database.sql
   - Ejecutar conectado a la base "postgres" (no a streemodb).
   - Cierra conexiones activas, elimina y crea la base `streemodb`.

2) 01_schema.sql
   - Ejecutar conectado a la base "streemodb".
   - Crea extensión `pgcrypto`, tablas, rol aplicativo `feresdev` con contraseña, privilegios, y datos de ejemplo (persona/usuario `feresdev`).

3) 02_procedimientos.sql (opcional)
   - Ejecutar conectado a la base "streemodb".
   - Crea todos los procedimientos almacenados consolidados (Persona, Usuario, Método de Pago, Tarjeta, Plan Principal, Pago Plan, Plan Cupo, Cupo Vendido, Pago Cupo).

## Notas importantes
- pgAdmin no soporta `\connect`. Por eso los scripts están separados.
- El archivo `1. Creacion de Tablas.sql` quedó como referencia histórica con una advertencia. No lo uses en pgAdmin.

## Variables de entorno (Next.js)
Crea/actualiza `.env.local` en la raíz del proyecto con:

```
DB_USER=feresdev
DB_PASSWORD=feresdev2025a*
DB_HOST=localhost
DB_PORT=5432
DB_NAME=streemodb
```

Luego reinicia la app si es necesario.

## Verificación desde la app
- GET /api/health  → público, debe responder `{ ok: true }` si hay conexión a DB.
- GET /api/ping    → requiere auth, devuelve NOW() si la sesión es válida.

## Troubleshooting rápido
- Si `01_schema.sql` falla por permisos, asegúrate de estar conectado a `streemodb`.
- Si `00_database.sql` falla al dropear, revisa conexiones abiertas a `streemodb` y vuelve a ejecutar.
