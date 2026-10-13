import axios from "axios";
import { NextResponse } from "next/server";

const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";

async function forward(request, context) {
  const { path } = await context.params;
  const endpoint = `/${path.join("/")}`;
  const requestBody = ["GET", "HEAD"].includes(request.method)
    ? undefined
    : await request.text();
  const authorization = request.headers.get("authorization");
  const cookie = request.headers.get("cookie");
  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");

  const config = {
    method: request.method,
    url: `${backendUrl}${endpoint}`,
    headers: {
      ...(authorization ? { Authorization: authorization } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
      ...(contentType ? { "Content-Type": contentType } : {}),
      ...(accept ? { Accept: accept } : {}),
    },
    validateStatus: () => true,
  };

  if (requestBody) config.data = requestBody;

  const response = await axios(config);
  const nextResponse = response.status === 204
    ? new NextResponse(null, { status: response.status })
    : NextResponse.json(response.data, { status: response.status });
  const setCookies = response.headers["set-cookie"] || [];

  for (const setCookie of setCookies) {
    nextResponse.headers.append("set-cookie", setCookie);
  }

  return nextResponse;
}

async function handle(request, context) {
  try {
    return await forward(request, context);
  } catch (error) {
    return NextResponse.json(
      error.response?.data || {
        status: false,
        error: { message: "Unable to reach the backend" },
      },
      { status: error.response?.status || 502 }
    );
  }
}

export const GET = handle;
export const POST = handle;
