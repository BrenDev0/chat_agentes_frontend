"use client";

import { Agent } from "@/types/agent";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (agent: Agent) => void;
}

export default function ModalAgentSelect({ isOpen, onClose, onSelect }: Props) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();

    const fetchAgents = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/agentCollection", {
          signal: controller.signal,
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const result = await res.json();

        setAgents(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [isOpen]);

  const handleSelect = (agent: Agent) => {
    setSelectedAgent(agent);
    onSelect(agent);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[500px] rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Seleccionar Agente</h2>
          <button onClick={onClose} className="text-gray-500 cursor-pointer">
            <IoIosCloseCircleOutline size={30} />
          </button>
        </div>

        {loading && (
          <div className="w-full flex flex-col justify-center items-center">
            <FaSpinner className="block animate-spin text-slate-800 w-5 h-5" />
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {agents.map((agent) => (
              <button
                key={agent.agentId}
                onClick={() => handleSelect(agent)}
                className={`cursor-pointer w-full text-left p-3 rounded-lg border transition hover:bg-gray-100 ${
                  selectedAgent?.agentId === agent.agentId
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200"
                }`}
              >
                <p className="font-medium">{agent.name}</p>
                {agent.description && (
                  <p className="text-sm text-gray-500">{agent.description}</p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
