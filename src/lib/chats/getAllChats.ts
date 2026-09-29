import "server-only";

import { cookies } from "next/headers";
import crypto from "crypto";

export async function getAllChats(agentId: string) {
  const payload = Date.now().toString();
  const secret = process.env.FRONTEND_HMAC_SECRET;

  console.log(agentId);

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
    query GetChatsAgents($agentId:UUID!) {
      chats {
        chatCollection(agentId:$agentId,pageNumber: 1,perPage: 10) {
          agentId
          chatId
          createdAt
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
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Error al comunicarse con el backend");
  }

  const result = await response.json();

  console.log(result);

  if (result.errors?.length) {
    throw new Error("Error GraphQL al obtener chats");
  }

  return result.data.chats.chatCollection;
}
