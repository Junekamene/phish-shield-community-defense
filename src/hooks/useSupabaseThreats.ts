
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

export const useSupabaseThreats = () => {
  const [threats, setThreats] = useState<ThreatData[]>([]);
  const [stats, setStats] = useState<ThreatStats>({
    totalThreats: 0,
    blockedToday: 0,
    accuracy: 94.7,
    activeUsers: 342
  });
  const [loading, setLoading] = useState(true);

  const fetchThreats = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-threats');
      
      if (error) throw error;

      const transformedThreats = data.threats.map((threat: any) => ({
        ...threat,
        timestamp: new Date(threat.created_at),
        riskLevel: threat.risk_level
      }));

      setThreats(transformedThreats);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching threats:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeThreat = async (content: string, type: 'url' | 'email') => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-threat', {
        body: { content, type }
      });

      if (error) throw error;

      // Refresh threats after analysis
      await fetchThreats();
      
      return data;
    } catch (error) {
      console.error('Error analyzing threat:', error);
      throw error;
    }
  };

  const submitCommunityReport = async (url: string, description: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('submit-community-report', {
        body: { url, description }
      });

      if (error) throw error;

      // Refresh threats after submission
      await fetchThreats();
      
      return data;
    } catch (error) {
      console.error('Error submitting community report:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchThreats();

    // Set up real-time subscription for new threats
    const channel = supabase
      .channel('threats-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'threats'
      }, () => {
        fetchThreats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    threats,
    stats,
    loading,
    analyzeThreat,
    submitCommunityReport,
    refetch: fetchThreats
  };
};
