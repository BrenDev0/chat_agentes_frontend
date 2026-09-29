import { getAllknowledges } from "@/lib/knowledgedocument/getAllknowledges";
import { redis } from "@/service/redis";
import { Knowledge } from "@/types/knowledge";
import { RedisItem } from "@/types/onholdTask";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    const allKnowledge = await getAllknowledges(id, "PROCESANDO");
    const value = await redis.get(`${id}_embeddings_tracker`);
    const data = JSON.parse(value ?? "{}");

    const redisData: (RedisItem & { knowledgeId: string })[] = Object.entries(
      data,
    ).map(([key, value]) => ({
      ...(value as RedisItem),
      knowledgeId: key,
    }));

    const statusMap = new Map(redisData.map((s) => [s.knowledgeId, s]));

    const merged = allKnowledge
      .filter((doc: Knowledge) => statusMap.has(doc.knowledgeId))
      .map((doc: Knowledge) => ({
        ...doc,
        ...statusMap.get(doc.knowledgeId),
      }));

    if (merged.length == 0) {
      return NextResponse.json(
        {
          data: merged,
          message: "No se obtuvieron datos",
          errors: "DataNull",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        data: merged,
      },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: "Ocurrio un error desconocido, contacte al administrador",
        errors: "ErrorServer",
      },
      { status: 500 },
    );
  }
}
