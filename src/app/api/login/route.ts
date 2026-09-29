import { setAuthCookie } from "@/lib/cookies";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        {
          message: "El email y la contraseña son obigatorios",
          errors: "validateData",
        },
        { status: 400 },
      );
    }

    const query = `
        mutation Login($email: String!, $password: String!) {
            users {
                login(
                    input: {
                        email: $email
                        password: $password
                    }
                ) {
                    token
                }
            }
        }
    `;

    const variables = {
      email: body.email,
      password: body.password,
    };

    const response = await fetch(`${process.env.SERVER_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();

    if (result.errors?.length) {
      return NextResponse.json(
        {
          message: "Ocurrio un error al iniciar sesión",
          errors: "ErrorLogin",
        },
        { status: 401 },
      );
    }

    const connectionId = crypto.randomUUID();
    const responseRequest = NextResponse.json(
      {
        token: result.data.users.login.token,
        connectionId,
      },
      { status: 200 },
    );
    setAuthCookie(responseRequest, result.data.users.login.token, "auth_token");
    return responseRequest;
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error al iniciar sesión, servicio no disponible",
        errors: error,
      },
      { status: 500 },
    );
  }
}
