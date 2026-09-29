export default async function getRedisData(agentId: string) {
  try {
    const res = await fetch(`/api/redis/${agentId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (err) {
    throw new Error("Ocurrio un error al obtener los procesos");
  }
}
