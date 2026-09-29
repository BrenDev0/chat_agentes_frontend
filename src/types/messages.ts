type authorMessage = "human" | "ai";

export type message = {
  chatId: string;
  createdAt: string;
  messageId: string;
  text: string;
  type: authorMessage;
};
