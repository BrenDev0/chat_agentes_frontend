import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const payload = Date.now().toString();
    const secret = process.env.FRONTEND_HMAC_SECRET;
    const cookie = await cookies();
    const token = cookie.get("auth_token")?.value;
    const { id } = await context.params;

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
    query GetMessageChats($chatId:UUID!) {
        messages {
            messageCollection(chatId: $chatId, pageNumber: 1, perPage: 10) {
                chatId
                createdAt
                messageId
                text
                type
            }
        }
    }
  `;

    const variable = {
      chatId: id,
    };

    const response = await fetch(process.env.SERVER_URL!, {
      method: "POST",
      headers: {
        "x-payload": payload,
        "x-signature": signature,
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: query,
        variables: variable,
      }),
      cache: "no-store",
    });

    const result = await response.json();

    if (result.errors?.length) {
      return NextResponse.json(
        {
          message: "Ocurrio un error al obtener los chats",
          errors: "ErrorUser",
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        data: result.data.messages.messageCollection,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Ocurrio un error desconocido, contacte al administrador",
        errors: "ErrorServer",
      },
      { status: 500 },
    );
  }
}
