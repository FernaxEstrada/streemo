import { NextResponse } from "next/server";

type ResponsePayload<T> = {
  data: T | null;
  error: T | null;
  msg: string;
};

type ResponseOptions = {
  status: number;
};

export default function apiResponse<T>(
  { data, error, msg }: ResponsePayload<T>,
  { status }: ResponseOptions
) {
  return NextResponse.json({ data, error, msg }, { status });
}
