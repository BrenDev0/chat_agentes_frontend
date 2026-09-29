"use client";

import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { log } from "node:console";
import { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  onchangeEmail: (newEmail: string) => void;
  onchangeName: (newName: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const result = await res.json();

        if (!res.ok) {
          setUser(null);
          setLoading(false);
          throw new Error("Error al obtener usuario");
        }
        setUser(result.dataUser);
        setLoading(false);
      } catch (error) {
        setUser(null);
        router.replace("/error");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const onchangeEmail = async (newEmail: string) => {
    setUser((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        email: newEmail,
      };
    });
  };

  const onchangeName = async (newName: string) => {
    setUser((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        name: newName,
      };
    });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        onchangeEmail,
        onchangeName,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useContextUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
