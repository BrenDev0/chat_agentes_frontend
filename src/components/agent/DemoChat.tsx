"use client";

import { useEffect, useState, useRef } from "react";

type Message = {
  role: "user" | "agent";
  content: string;
};

const demoConversation: Message[] = [
  { role: "user", content: "Hola" },
  { role: "agent", content: "Hola 👋 ¿En qué puedo ayudarte hoy?" },

  { role: "user", content: "Quiero información sobre mis pedidos" },
  {
    role: "agent",
    content: "Claro, puedo ayudarte con eso. ¿Tienes el número de pedido?",
  },

  { role: "user", content: "Sí, es el 45821" },
  {
    role: "agent",
    content: "Perfecto. Estoy revisando el estado de tu pedido...",
  },

  { role: "user", content: "¿Cuándo llegará?" },
  {
    role: "agent",
    content: "Tu pedido está en camino 🚚 y llegará mañana antes de las 6pm.",
  },

  { role: "user", content: "Muchas gracias" },
  {
    role: "agent",
    content: "Con gusto 😊 Si necesitas algo más, aquí estaré para ayudarte.",
  },
];

export default function DemoChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageIndex >= demoConversation.length) return;

    const message = demoConversation[messageIndex];
    setIsTyping(true);
    setCurrentText("");

    let i = 0;
    const typingInterval = setInterval(() => {
      setCurrentText(message.content.slice(0, i + 1));
      i++;

      if (i === message.content.length) {
        clearInterval(typingInterval);

        setTimeout(() => {
          setMessages((prev) => [...prev, message]);
          setCurrentText("");
          setMessageIndex((prev) => prev + 1);
          setIsTyping(false);
        }, 800);
      }
    }, 25);

    return () => clearInterval(typingInterval);
  }, [messageIndex]);

  // Scroll automático
  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, currentText]);

  return (
    <>
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`p-3 rounded-2xl max-w-xs text-sm ${
            msg.role === "user"
              ? "bg-indigo-600 text-white self-end"
              : "bg-slate-200 text-slate-900 self-start"
          }`}
        >
          {msg.content}
        </div>
      ))}

      {isTyping && (
        <div
          className={`p-3 rounded-2xl max-w-xs text-sm ${
            demoConversation[messageIndex]?.role === "user"
              ? "bg-indigo-600 text-white self-end"
              : "bg-slate-200 text-slate-900 self-start"
          }`}
        >
          {currentText}
        </div>
      )}
    </>
  );
}
