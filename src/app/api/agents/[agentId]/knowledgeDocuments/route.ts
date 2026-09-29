import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

interface RouteContext {
  params: Promise<{
    agentId: string;
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
    const { agentId } = await context.params;
    const body = await request.formData();
    const file = body.getAll("file") as File[];
    const description = body.get("description");
    const connectionId = body.get("connectionId");
    const useForTrainingRaw = body.get("useForTraining");
    const useForTraining = useForTrainingRaw === "true";

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
        mutation AddKnowledge($agentId:UUID!,$file:Upload!,$description:String!,$embedDocument:Boolean!,$connectionId:UUID) {
        knowledgeBase {
          uploadKnowledge(agentId: $agentId, file: $file,embedDocument: $embedDocument
            input: {
            description:$description,
            connectionId:$connectionId
            }){
              agentId
              createdAt
              description
              state
              knowledgeId
              name
              type
              url
          }
        }
      }
    `;

    const variables = {
      agentId: agentId,
      file: null,
      description: description,
      embedDocument: useForTraining,
      connectionId: connectionId,
    };

    const formData = new FormData();
    formData.append(
      "operations",
      JSON.stringify({
        query,
        variables,
      }),
    );

    formData.append(
      "map",
      JSON.stringify({
        "0": ["variables.file"],
      }),
    );

    formData.append("0", file[0]);

    const response = await fetch(`${process.env.SERVER_URL}`, {
      method: "POST",
      headers: {
        "x-payload": payload,
        "x-signature": signature,
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (result.errors?.length) {
      return NextResponse.json(
        {
          message: "Ocurrio un error al guardar el documento",
          errors: "ErrorAgent",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        dataKnowledge: result.data.knowledgeBase.uploadKnowledge,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Ocurrio un error desconocido, contacte al administrador",
        errors: "ErrorServer",
      },
      { status: 500 },
    );
  }
}
