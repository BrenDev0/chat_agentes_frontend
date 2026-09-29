export async function rollbackAgent(
  agentId: string,
  payload: string,
  signature: string,
  token?: string
) {
  const deleteQuery = `
    mutation DeleteAgent($agentId: UUID!) {
      agents {
        agentDelete(agentId: $agentId){
          agentId
          agentState
          createdAt
          description
          name
          userId
        }
      }
    }
  `;

  const variable = {
    agentId: agentId,
  };

  try {
    const rollbackResponse = await fetch(`${process.env.SERVER_URL}`, {
      method: "POST",
      headers: {
        "x-payload": payload,
        "x-signature": signature,
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: deleteQuery,
        variables: variable,
      }),
    });

    const rollbackResult = await rollbackResponse.json();
    console.log(rollbackResult);
  } catch (error) {
    console.log("ROLLBACK FAILED", agentId);
  }
}
