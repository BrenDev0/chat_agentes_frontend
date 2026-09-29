export type ModeModal = "DELETE" | "PROCESS" | "DATA";

export type Modal = {
  title: string;
  desc: string;
  confirmText: string;
  type: ModeModal;
};
