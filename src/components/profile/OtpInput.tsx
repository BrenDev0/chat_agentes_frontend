"use client";

import { useEffect, useRef, useState } from "react";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export default function OtpInput({
  value,
  onChange,
  length = 6,
}: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [digits, setDigits] = useState<string[]>(
    Array.from({ length }, (_, i) => value[i] ?? ""),
  );

  useEffect(() => {
    const next = Array.from({ length }, (_, i) => value[i] ?? "");
    setDigits(next);
  }, [value, length]);

  const update = (next: string[]) => {
    setDigits(next);
    onChange(next.join(""));
  };

  const handleChange = (index: number, val: string) => {
    if (!/^\d?$/.test(val)) return;

    const next = [...digits];
    next[index] = val;
    update(next);

    if (val && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...digits];

      if (digits[index]) {
        next[index] = "";
      } else if (index > 0) {
        next[index - 1] = "";
        inputsRef.current[index - 1]?.focus();
      }

      update(next);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;

    const next = Array.from({ length }, (_, i) => pasted[i] ?? "");
    update(next);

    const lastIndex = Math.min(pasted.length, length) - 1;
    inputsRef.current[lastIndex]?.focus();
  };

  return (
    <div className="flex justify-center gap-2" onPaste={handlePaste}>
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          className="w-9 h-9 lg:w-12 lg:h-12 text-center text-md lg:text-lg font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      ))}
    </div>
  );
}
