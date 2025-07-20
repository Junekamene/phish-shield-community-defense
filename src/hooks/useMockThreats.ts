import { useState, useEffect } from 'react';

export interface ThreatData {
  id: string;
  type: "email" | "url" | "community" | "ai_detected";
  content: string;
  risk_level: "low" | "medium" | "high" | "critical";
  timestamp: Date;
  location?: string;
  verified: boolean;
  votes: number;
  created_at: string;
}

export interface ThreatStats {
  totalThreats: number;
  blockedToday: number;
  accuracy: number;
  activeUsers: number;
  criticalThreats?: number;
  highThreats?: number;
}

// Mock data
const mockThreats: ThreatData[] = [
  {
    id: "1",
    type: "url",
    content: "https://phishing-site-example.com/login",
    risk_level: "critical",
    timestamp: new Date(),
    location: "Russia",
    verified: true,
    votes: 15,
    created_at: new Date().toISOString()
  },
  {
    id: "2",
    type: "email",
    content: "Your account has been suspended. Click here to verify: suspicious-link.com",
    risk_level: "high",
    timestamp: new Date(Date.now() - 3600000),
    location: "China",
    verified: true,
    votes: 12,
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "3",
    type: "community",
    content: "Fake banking website detected: fake-bank.net",
    risk_level: "medium",
    timestamp: new Date(Date.now() - 7200000),
    location: "United States",
    verified: false,
    votes: 8,
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: "4",
    type: "ai_detected",
    content: "Suspicious cryptocurrency scam: crypto-scam.org",
    risk_level: "high",
    timestamp: new Date(Date.now() - 10800000),
    location: "Nigeria",
    verified: true,
    votes: 20,
    created_at: new Date(Date.now() - 10800000).toISOString()
  }
];

export const useMockThreats = () => {
  const [threats, setThreats] = useState<ThreatData[]>(mockThreats);
  const [stats, setStats] = useState<ThreatStats>({
    totalThreats: mockThreats.length,
    blockedToday: 2,
    accuracy: 94.7,
    activeUsers: 342,
    criticalThreats: 1,
    highThreats: 2
  });
  const [loading, setLoading] = useState(false);

  const analyzeThreat = async (content: string, type: 'url' | 'email') => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock analysis result
    const riskLevels: Array<"low" | "medium" | "high" | "critical"> = ["low", "medium", "high", "critical"];
    const randomRisk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    
    const newThreat: ThreatData = {
      id: Date.now().toString(),
      type: type,
      content: content,
      risk_level: randomRisk,
      timestamp: new Date(),
      location: "AI Detection",
      verified: false,
      votes: 1,
      created_at: new Date().toISOString()
    };

    setThreats(prev => [newThreat, ...prev]);
    setStats(prev => ({
      ...prev,
      totalThreats: prev.totalThreats + 1,
      blockedToday: randomRisk === 'high' || randomRisk === 'critical' ? prev.blockedToday + 1 : prev.blockedToday
    }));

    setLoading(false);
    
    return {
      threat: newThreat,
      analysis: `Risk Level: ${randomRisk.toUpperCase()}`,
      confidence: Math.floor(Math.random() * 30) + 70
    };
  };

  const submitCommunityReport = async (url: string, description: string) => {
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newThreat: ThreatData = {
      id: Date.now().toString(),
      type: "community",
      content: `${url} - ${description}`,
      risk_level: "medium",
      timestamp: new Date(),
      location: "Community Report",
      verified: false,
      votes: 1,
      created_at: new Date().toISOString()
    };

    setThreats(prev => [newThreat, ...prev]);
    setStats(prev => ({
      ...prev,
      totalThreats: prev.totalThreats + 1
    }));

    setLoading(false);
    
    return {
      success: true,
      message: "Community report submitted successfully"
    };
  };

  return {
    threats,
    stats,
    loading,
    analyzeThreat,
    submitCommunityReport,
    refetch: () => Promise.resolve()
  };
};