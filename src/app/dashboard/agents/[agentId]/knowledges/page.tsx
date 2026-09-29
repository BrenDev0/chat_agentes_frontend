import KnowledgeList from "@/components/knowledgeAgent/knowledgeList";
import { getAllknowledges } from "@/lib/knowledgedocument/getAllknowledges";

interface PageProps {
  params: {
    agentId: string;
  };
}

export default async function KnowledgePage({ params }: PageProps) {
  const { agentId } = await params;
  const knowLedge = await getAllknowledges(agentId, "");

  return <KnowledgeList agentId={agentId} dataKnowledge={knowLedge} />;
}
