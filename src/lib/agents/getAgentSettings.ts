import "server-only";

import { cookies } from "next/headers";
import crypto from "crypto";

export async function getAgentSettings(agentId: string) {
  const payload = Date.now().toString();
  const secret = process.env.FRONTEND_HMAC_SECRET;

  if (!secret) {
    throw new Error("HMAC secret no configurado");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    throw new Error("Usuario no autenticado");
  }

  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  const query = `
    query GetAgent($agentId:UUID!) {
      agents {
        agentResource (agentId: $agentId) {
          agentId
          name
          description
          createdAt
          userId
          agentState
        }
      }
    }
  `;

  const variable = {
    agentId,
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
  });

  if (!response.ok) {
    throw new Error("Error al comunicarse con el backend");
  }

  const result = await response.json();

  if (result.errors?.length) {
    throw new Error("Error GraphQL al obtener agentes");
  }

  const querySetting = `
    query GetAgentSetting($agentId:UUID!) {
      agentSettings {
        agentSettingsResource (agentId: $agentId) {
          settingId
          systemPrompt
          temperature
          transcripts
        }
      }
    }
  `;

  const variableSettings = {
    agentId,
  };

  const responseSettings = await fetch(process.env.SERVER_URL!, {
    method: "POST",
    headers: {
      "x-payload": payload,
      "x-signature": signature,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: querySetting,
      variables: variableSettings,
    }),
    cache: "no-store",
  });

  if (!responseSettings.ok) {
    throw new Error("Error al comunicarse con el backend");
  }

  const resultSettings = await responseSettings.json();

  if (resultSettings.errors?.length) {
    throw new Error("Error GraphQL al obtener los settings del agente");
  }

  return {
    dataAgent: result.data.agents.agentResource,
    dataSettingAgent: resultSettings.data.agentSettings.agentSettingsResource,
  };
}
