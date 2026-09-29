import AgentList from "@/components/agent/AgentsList";
import { getAllAgents } from "@/lib/agents/getAllAgents";

export default async function AgentsPage() {
  const agents = await getAllAgents();

  return <AgentList dataAgents={agents} />;
}
