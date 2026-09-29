import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { rollbackAgent } from "@/lib/agents/rollbackAgent";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const payload = Date.now().toString();
    const secret = process.env.FRONTEND_HMAC_SECRET;
    const cookie = await cookies();
    const token = cookie.get("auth_token")?.value;
    const { operation, body } = await request.json();

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

    if (operation === "create") {
      query = `
        mutation AddNewAgent($name:String!,$description:String!) {
            agents {
                agentCreate(
                        input: {
                            name: $name, 
                            description: $description
                        }
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

      variables = {
        name: body.name,
        description: body.description,
      };
    }

    if (operation === "update") {
      query = `
        mutation UpdateAgent($agentId:UUID!,$name:String!,$description:String!) {
            agents {
                updateAgent(
                        agentId: $agentId,
                        input: {
                            name: $name, 
                            description: $description
                        }
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

      variables = {
        agentId: body.agentId,
        name: body.name,
        description: body.description,
      };
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

    const agent =
      operation === "create"
        ? result.data.agents.agentCreate
        : result.data.agents.updateAgent;

    const agentId = agent?.agentId;

    if (result.errors?.length) {
      return NextResponse.json(
        {
          message: "Ocurrio un error al guardar el agente",
          errors: "ErrorAgent",
        },
        { status: 400 },
      );
    }

    if (!agentId) {
      return NextResponse.json(
        {
          message: "Ocurrio un error al guardar el agente",
          errors: "ErrorAgent",
        },
        { status: 400 },
      );
    }

    let settingsQuery = "";
    let variableSettings: any = {};

    if (operation === "create") {
      settingsQuery = `
        mutation CreategentSettings($agentId:UUID!,$systemPrompt:String!,$temperature:Float!,$transcripts:Boolean!) {
            agentSettings {
                createAgentSettings(
                    agentId: $agentId
                    input: { systemPrompt: $systemPrompt, temperature: $temperature, transcripts: $transcripts }
                ) {
                    settingId
                    systemPrompt
                    temperature
                    transcripts
                }
            }
        }
      `;

      variableSettings = {
        agentId,
        systemPrompt: body.systemPrompt,
        temperature: body.temperature,
        transcripts: body.transcripts,
      };
    }

    if (operation === "update") {
      settingsQuery = `
        mutation UpdategentSettings($settingId:UUID!,$systemPrompt:String!,$temperature:Float!,$transcripts:Boolean!) {
            agentSettings {
                updateAgentSettings(
                    settingsId: $settingId,
                    input: { systemPrompt: $systemPrompt, temperature: $temperature, transcripts: $transcripts }
                ) {
                    settingId
                    systemPrompt
                    temperature
                    transcripts
                }
            }
        }
      `;

      variableSettings = {
        settingId: body.settingId,
        systemPrompt: body.systemPrompt,
        temperature: body.temperature,
        transcripts: body.transcripts,
      };
    }

    const settingsResponse = await fetch(`${process.env.SERVER_URL}`, {
      method: "POST",
      headers: {
        "x-payload": payload,
        "x-signature": signature,
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: settingsQuery,
        variables: variableSettings,
      }),
    });

    const settingsResult = await settingsResponse.json();

    if (settingsResult.errors?.length) {
      if (operation === "create") {
        await rollbackAgent(agentId, payload, signature, token);
      }

      return NextResponse.json(
        {
          message: "Error en configuración del agente",
          errors: "ErrorAgentSettings",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        agent,
        settings: settingsResult.data,
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
