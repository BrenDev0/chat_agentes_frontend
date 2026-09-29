import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { setAuthCookie } from "@/lib/cookies";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const payload = Date.now().toString();
    const secret = process.env.FRONTEND_HMAC_SECRET;
    const cookie = await cookies();
    // const token = cookie.get("auth_token")?.value;
    const body = await request.json();

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

    const query = `
    mutation VerifiedCode($verificationCode:Int!) {
        users {
            verifiedLogin(input: {verificationCode:$verificationCode}) {
                token
            }
        }
    }
    `;

    const variable = {
      verificationCode: Number(body.code),
    };

    const response = await fetch(`${process.env.SERVER_URL}`, {
      method: "POST",
      headers: {
        "x-payload": payload,
        "x-signature": signature,
        "Content-Type": "application/json",
        Authorization: `Bearer ${body.token}`,
      },
      body: JSON.stringify({
        query: query,
        variables: variable,
      }),
    });

    const result = await response.json();

    console.log(response);

    if (result.errors?.length) {
      return NextResponse.json(
        {
          message: "Ocurrio un error al verificar el codigo",
          errors: "ErrorCodeVerify",
        },
        { status: 401 },
      );
    }

    const responseRequest = NextResponse.json(
      {
        token: result.data.users.verifiedLogin,
      },
      { status: 200 },
    );

    setAuthCookie(
      responseRequest,
      result.data.users.verifiedLogin.token,
      "auth_token",
    );
    return responseRequest;
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      {
        message: "Ocurrio un error inesperado. intente nuevamente",
        errors: "ErrorServer",
      },
      { status: 500 },
    );
  }
}
