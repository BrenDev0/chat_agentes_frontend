import AgentForm from "@/components/agent/AgentForm";
import { getAgentSettings } from "@/lib/agents/getAgentSettings";

interface PageProps {
  params: {
    agentId: string;
  };
}

export default async function AgentSettingsPage({ params }: PageProps) {
  const { agentId } = await params;
  const agent = await getAgentSettings(agentId);

  return (
    <div className="p-4 lg:p-8 max-w-8xl mx-auto">
      <AgentForm defaultValues={agent} />
    </div>
  );
}
