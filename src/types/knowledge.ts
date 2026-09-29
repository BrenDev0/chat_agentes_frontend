export type ItemState = "PROCESANDO" | "PROCESADO" | "NO PROCESADO" | "ERROR";

export type Knowledge = {
  knowledgeId: string;
  agentId: string;
  name: string;
  type: string;
  description: string;
  state: ItemState;
  createdAt: string;
  size: string;
};

export type KnowledgeProcess = {
  knowledgeId: string;
  stage: string;
  status: string;
  progress: number;
  agentId: string;
  name: string;
  type: string;
  description: string;
  state: ItemState;
  createdAt: string;
  size: string;
};
