import { Context } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";

export type ApiResponsePayload<T> = {
  data: T | null;
  error: any | null;
  ok: boolean;
};
export type ApiResponseStatus = { status: number | ContentfulStatusCode };

export default function apiResponse<T>(
  { response }: { response: Context },
  { data, error, ok }: ApiResponsePayload<T>,
  { status }: ApiResponseStatus
) {
  return response.json({ data, error, ok }, status as any);
}
