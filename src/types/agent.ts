import { getAgentSettings } from "@/lib/agents/getAgentSettings";
export type Agent = {
  agentId: string;
  userId: string;
  name: string;
  description: string;
  createdAt: string;
  agentState: boolean;
};

export type AgentSettings = {
  systemPrompt: string;
  temperature: number;
  transcripts: boolean;
  settingId: string;
};

export type AllAgentData = {
  dataAgent: Agent;
  dataSettingAgent: AgentSettings;
};
