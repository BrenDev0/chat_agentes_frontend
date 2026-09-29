import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";

export async function GET(request: Request) {
  const connectionId = crypto.randomUUID();
  const payload = Date.now().toString();
  const secret = process.env.FRONTEND_HMAC_SECRET;

  if (!secret) {
    return NextResponse.json(
      {
        message:
          "Ocurrio un error interno, contacte al administrador del sistema",
        errors: "criptoString",
      },
      { status: 403 },
    );
  }

  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return NextResponse.json({ connectionId, payload, signature });
}
