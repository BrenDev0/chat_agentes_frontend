import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

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
    mutation VerifiedUpdatedEmail($code:Int!,$email:String!) {
        users {
            verifiedUpdate(input: {code:$code, email:$email}) {
                createdAt
                lastLogin
                email
                name
                userId
            }
        }
    }
    `;

    const variable = {
      email: body.email,
      code: Number(body.code),
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

    if (result.errors?.length) {
      return NextResponse.json(
        {
          message: "Ocurrio un error al actualizar el email",
          errors: "ErrorEmailUpdate",
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        token: result.data.users.verifiedUpdate,
      },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: "Ocurrio un error inesperado. intente nuevamente",
        errors: "ErrorServer",
      },
      { status: 500 },
    );
  }
}
