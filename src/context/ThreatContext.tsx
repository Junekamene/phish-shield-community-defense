import React, { createContext, useContext, useState, useEffect } from "react";
import { useSupabaseThreats, ThreatData, ThreatStats } from "@/hooks/useSupabaseThreats";

interface ThreatContextType {
  threats: ThreatData[];
  stats: ThreatStats;
  loading: boolean;
  analyzeThreat: (content: string, type: 'url' | 'email') => Promise<any>;
  submitCommunityReport: (url: string, description: string) => Promise<any>;
  alerts: Array<{ id: string; message: string; type: string; timestamp: Date }>;
  addAlert: (message: string, type: string) => void;
  removeAlert: (id: string) => void;
  addThreat: (threat: Omit<ThreatData, "id" | "timestamp">) => void; // Keep for backward compatibility
}

const ThreatContext = createContext<ThreatContextType | undefined>(undefined);

export const ThreatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { threats, stats, loading, analyzeThreat, submitCommunityReport } = useSupabaseThreats();
  const [alerts, setAlerts] = useState<Array<{ id: string; message: string; type: string; timestamp: Date }>>([]);

  // Keep for backward compatibility with existing components
  const addThreat = (threat: Omit<ThreatData, "id" | "timestamp">) => {
    // This is now handled by the backend, but we keep the function for compatibility
    console.log('addThreat called - now handled by backend');
  };

  const addAlert = (message: string, type: string) => {
    const alert = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
      timestamp: new Date()
    };
    setAlerts(prev => [alert, ...prev.slice(0, 4)]);
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <ThreatContext.Provider value={{
      threats,
      stats,
      loading,
      analyzeThreat,
      submitCommunityReport,
      addThreat,
      alerts,
      addAlert,
      removeAlert
    }}>
      {children}
    </ThreatContext.Provider>
  );
};

export const useThreat = () => {
  const context = useContext(ThreatContext);
  if (!context) {
    throw new Error("useThreat must be used within a ThreatProvider");
  }
  return context;
};
