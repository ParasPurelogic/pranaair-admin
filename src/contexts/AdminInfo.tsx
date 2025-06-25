"use client";

import { AdminInfo } from "@/types";
import { ReactNode, createContext, useContext } from "react";

type ProviderProps = {
  children: ReactNode;
  adminInfo: AdminInfo | null;
};

const AdminInfoContext = createContext<AdminInfo | null>(null);

export function AdminInfoProvider(props: ProviderProps) {
  // Get admin Info;
  return (
    <AdminInfoContext.Provider value={props.adminInfo}>
      {props.children}
    </AdminInfoContext.Provider>
  );
}

export const useAdminInfo = () => {
  return useContext(AdminInfoContext);
};
