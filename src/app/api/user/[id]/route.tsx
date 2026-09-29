import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const payload = Date.now().toString();
    const secret = process.env.FRONTEND_HMAC_SECRET;
    const cookie = await cookies();
    const token = cookie.get("auth_token")?.value;
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
        mutation ChangePassword($oldPassword:String,$newPassword:String){
            users {
                updateUser (
                    input: {
                        oldPassword:$oldPassword,
                        password:$newPassword
                    }
                ){
                    userId
                    name
                    email
                    lastLogin
                    createdAt
                }
            }
        }
    `;

    const variables = {
      oldPassword: body.oldPassword,
      newPassword: body.newPassword,
    };

    const response = await fetch(`${process.env.SERVER_URL}`, {
      method: "POST",
      headers: {
        "x-payload": payload,
        "x-signature": signature,
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();

    if (result.errors?.length) {
      return NextResponse.json(
        {
          message: "Ocurrio un error al actualizar la constraseña",
          errors: "ErrorUsers",
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        dataUser: result.data.users.updateUser,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        type: "error",
        detail: "Error internal server error",
        ...(error instanceof Error ? { info: error.message } : {}),
      },
      { status: 500 },
    );
  }
}
