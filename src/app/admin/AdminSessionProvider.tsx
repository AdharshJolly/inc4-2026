"use client";

import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";

interface AdminContextType {
  logout: () => void;
}

export const AdminSessionContext = createContext<AdminContextType | null>(null);

export function AdminSessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.refresh();
    router.push("/admin/login");
  };

  return (
    <AdminSessionContext.Provider value={{ logout: handleLogout }}>
      {children}
    </AdminSessionContext.Provider>
  );
}
