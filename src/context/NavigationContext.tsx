"use client";

import { createContext, useContext, useState } from "react";

interface NavigationContextType {
  isOpen: boolean;
  toggle: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <NavigationContext.Provider value={{ isOpen, toggle }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useContextNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
