import OnHoldList from "@/components/onhold/OnHoldList";

interface PageProps {
  params: {
    agentId: string;
  };
}

export default async function OnHoldPage({ params }: PageProps) {
  const { agentId } = await params;
  return <OnHoldList agentId={agentId} />;
}
