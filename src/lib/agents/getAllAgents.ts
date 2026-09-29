import "server-only";

import { cookies } from "next/headers";
import crypto from "crypto";

export async function getAllAgents() {
  try {
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
    query GetAgents {
      agents {
        agentCollection {
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

    const response = await fetch(process.env.SERVER_URL!, {
      method: "POST",
      headers: {
        "x-payload": payload,
        "x-signature": signature,
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Error al comunicarse con el backend");
    }

    const result = await response.json();

    if (result.errors?.length) {
      throw new Error("Error GraphQL al obtener agentes");
    }

    return result.data.agents.agentCollection;
  } catch (err) {
    throw new Error("Ocurrio un error de conexion, contacte al administrador");
  }
}
