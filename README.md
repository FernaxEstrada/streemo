# Streemo

Sistema para gestionar planes principales, planes de cupo, ventas de cupo y pagos.

## Tech Stack

- Next.js 15 (App Router)
- React 19, TypeScript
- PostgreSQL (pg)
- Validación con Zod
- ESLint 9, Tailwind 4 (postcss)

## Requisitos

- Node 18+ (recomendado LTS)
- PostgreSQL 13+

## Variables de entorno

Crear `.env.local` en la raíz con:

```
DB_USER=feresdev
DB_PASSWORD=feresdev2025a*
DB_HOST=localhost
DB_PORT=5432
DB_NAME=streemodb
```

## Base de datos

Ver instrucciones detalladas en `db/README.md`.

Resumen rápido (pgAdmin):

1. Ejecutar `db/00_database.sql` conectado a `postgres` (ejecutar sentencias por separado si es necesario).
2. Ejecutar `db/01_schema.sql` conectado a `streemodb`.
3. (Opcional) Ejecutar `db/02_procedimientos.sql` conectado a `streemodb`.

## Scripts

- `npm run dev`: desarrollo (Turbopack)
- `npm run build`: build
- `npm run start`: producción
- `npm run lint`: lint

## Ejecutar en desarrollo

```bash
npm run dev
```

Abrir http://localhost:3000

## Endpoints clave

- `GET /api/health` (público): responde `{ ok: true }` o `503 unhealthy` sin detalles sensibles.
- `POST /api/cupo-vendido` (requiere auth): crea un cupo vendido. `fechaInicio` debe ser `DD/MM/YYYY`.

## Estructura

- `src/app/`: rutas (páginas y API)
  - `api/health/route.ts`: health check
  - `api/cupo-vendido/`: CRUD cupo vendido y auxiliares
  - `api/schemas/`: validaciones Zod
  - `api/lib/`: auth, mapeadores, etc.
- `src/components/`: UI (formularios, tablas, layouts)
- `src/context/`: contextos (`AuthContext`, `DataContext`)
- `db/`: scripts SQL
