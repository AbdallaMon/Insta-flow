"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Alert, AlertColor, Snackbar } from "@mui/material";
import { Setter } from "@/shared/types/general";

type MuiAlertContextType = {
  setAlertError: Setter<string | null>;
  setSeverity: Setter<AlertColor>;
};

export const MuiAlertContext = createContext<MuiAlertContextType | null>(null);

export default function MuiAlertProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [error, setAlertError] = useState<string | null>(null);
  const [severity, setSeverity] = useState<AlertColor>("error");
  const open = Boolean(error && error.length > 0);
  function handleClose() {
    setAlertError(null);
  }

  return (
    <MuiAlertContext.Provider value={{ setAlertError, setSeverity }}>
      <Snackbar open={open} onClose={handleClose} autoHideDuration={3000}>
        <Alert severity={severity} variant="filled" onClose={handleClose}>
          {error}
        </Alert>
      </Snackbar>
      {children}
    </MuiAlertContext.Provider>
  );
}
export const useAlertContext = () => {
  const context = useContext(MuiAlertContext);
  if (!context) {
    throw new Error("useAlertContext must be used within MuiAlertProvider");
  }
  return context;
};
