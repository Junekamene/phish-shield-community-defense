
import React, { createContext, useContext, useState, useEffect } from "react";

export interface ThreatData {
  id: string;
  type: "email" | "url" | "community";
  content: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  timestamp: Date;
  location?: string;
  verified: boolean;
  votes: number;
}

export interface ThreatStats {
  totalThreats: number;
  blockedToday: number;
  accuracy: number;
  activeUsers: number;
}

interface ThreatContextType {
  threats: ThreatData[];
  stats: ThreatStats;
  addThreat: (threat: Omit<ThreatData, "id" | "timestamp">) => void;
  alerts: Array<{ id: string; message: string; type: string; timestamp: Date }>;
  addAlert: (message: string, type: string) => void;
  removeAlert: (id: string) => void;
}

const ThreatContext = createContext<ThreatContextType | undefined>(undefined);

export const ThreatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [threats, setThreats] = useState<ThreatData[]>([]);
  const [alerts, setAlerts] = useState<Array<{ id: string; message: string; type: string; timestamp: Date }>>([]);
  
  const [stats, setStats] = useState<ThreatStats>({
    totalThreats: 1247,
    blockedToday: 89,
    accuracy: 94.7,
    activeUsers: 342
  });

  const addThreat = (threat: Omit<ThreatData, "id" | "timestamp">) => {
    const newThreat: ThreatData = {
      ...threat,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };
    
    setThreats(prev => [newThreat, ...prev.slice(0, 49)]);
    setStats(prev => ({
      ...prev,
      totalThreats: prev.totalThreats + 1,
      blockedToday: prev.blockedToday + 1
    }));

    // Add alert for high-risk threats
    if (threat.riskLevel === "high" || threat.riskLevel === "critical") {
      addAlert(
        `${threat.riskLevel.toUpperCase()} THREAT DETECTED: ${threat.type} submission flagged`,
        "danger"
      );
    }
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

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1,
        accuracy: Math.max(90, Math.min(99, prev.accuracy + (Math.random() - 0.5) * 0.1))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ThreatContext.Provider value={{
      threats,
      stats,
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
