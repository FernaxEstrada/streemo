import { db } from "../utils/db";
import apiResponse from "../utils/apiResponse";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    const result = await db.query("SELECT 1 AS ok;");
    const ok = result.rows?.[0]?.ok === 1;
    return apiResponse({ data: { ok }, error: null, msg: "ok!" }, { status: ok ? 200 : 500 });
  } catch {
    // No exponer detalles de error en un endpoint público de salud
    // Responder de forma genérica para evitar filtraciones de información sensible
    return apiResponse(
      { data: { ok: false }, error: null, msg: "unhealthy" },
      { status: 503 }
    );
  }
}
