import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const payload = Date.now().toString();
    const secret = process.env.FRONTEND_HMAC_SECRET;
    const cookie = await cookies();
    const token = cookie.get("auth_token")?.value;
    const { body } = await request.json();

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
        mutation DeleteAgent($agentId:UUID!) {
            agents {
                agentDelete(
                    agentId: $agentId
                ) {
                    description
                    createdAt
                    agentId
                    name
                    userId
                }
            }
        }
    `;

    const variables = {
      agentId: body,
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
          message: "Ocurrio un error al eliminar el agente",
          errors: "ErrorAgent",
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        dataUser: result.data.agents.agentDelete,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Ocurrio un error inesperado. intente nuevamente",
        errors: "ErrorServer",
      },
      { status: 500 },
    );
  }
}
