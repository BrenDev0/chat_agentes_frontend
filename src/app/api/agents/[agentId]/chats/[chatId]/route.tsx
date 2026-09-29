import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

interface RouteContext {
  params: Promise<{
    chatId: string;
  }>;
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  try {
    const payload = Date.now().toString();
    const secret = process.env.FRONTEND_HMAC_SECRET;
    const cookie = await cookies();
    const token = cookie.get("auth_token")?.value;
    const { chatId } = await context.params;
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

    let query = "";
    let variables: any = {};

    switch (body.operation) {
      case "DELETE":
        query = `
        mutation DeleteChat($chatId:UUID!) {
            chats {
                deleteChat(chatId:$chatId) {
                    agentId
                    chatId
                    createdAt
                }
            }
        }
    `;

        variables = {
          chatId: chatId,
        };

        break;

      //   case "PROCESS":
      //     query = `
      //     mutation InitProcess ($connectionId:UUID!,$knowledgeId:UUID!) {
      //         knowledgeBase {
      //             createEmbeddings(connectionId:$connectionId, knowledgeId:$knowledgeId) {
      //                 agentId
      //                 createdAt
      //                 description
      //                 knowledgeId
      //                 name
      //                 size
      //                 state
      //                 type
      //                 url
      //             }
      //         }
      //     }
      // `;

      //     variables = {
      //       knowledgeId: knowledgeId,
      //       connectionId: body.connectionId,
      //     };

      //     break;

      //   case "DATA":
      //     query = `
      //     mutation DeleteDataProcess ($knowledgeId:UUID!) {
      //         knowledgeBase {
      //             deleteEmbeddings(knowledgeId:$knowledgeId) {
      //                 agentId
      //                 createdAt
      //                 description
      //                 knowledgeId
      //                 name
      //                 size
      //                 state
      //                 type
      //                 url
      //             }
      //         }
      //     }
      // `;

      //     variables = {
      //       knowledgeId: knowledgeId,
      //     };
      //     break;
    }

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

    console.log(result);

    let data;

    switch (body.operation) {
      case "DELETE":
        data = result.data.chats.deleteChat;
        break;

      //   case "PROCESS":
      //     data = result.data.knowledgeBase.createEmbeddings;
      //     break;

      //   case "DATA":
      //     data = result.data.knowledgeBase.deleteEmbeddings;
      //     break;

      default:
        data = null;
    }

    if (result.errors?.length) {
      return NextResponse.json(
        {
          message: "Ocurrio un error al guardar el agente",
          errors: "ErrorAgent",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        data,
      },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      {
        message: "Ocurrio un error desconocido, contacte al administrador",
        errors: "ErrorServer",
      },
      { status: 500 },
    );
  }
}
