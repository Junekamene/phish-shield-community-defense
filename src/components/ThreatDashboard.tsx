import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useThreat } from "@/context/ThreatContext";
import { ThreatMetrics } from "./ThreatMetrics";
import { ThreatMap } from "./ThreatMap";
import { RealtimeChart } from "./RealtimeChart";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { Wand2 } from "lucide-react";

export const ThreatDashboard = () => {
  const { threats, loading } = useThreat();
  const navigate = useNavigate();

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full bg-gray-800/50" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full bg-gray-800/50" />
          <Skeleton className="h-64 w-full bg-gray-800/50" />
        </div>
        <Skeleton className="h-96 w-full bg-gray-800/50" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <ThreatMetrics />
        <Button
          onClick={() => navigate('/flowchart-generator')}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          AI Flowchart Generator
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RealtimeChart />
        <ThreatMap />
      </div>

      <Card className="bg-black/60 border-green-500/30 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            Recent Threat Detections
            <Badge variant="outline" className="border-green-400 text-green-400">
              Live Feed
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-96 overflow-y-auto">
          {threats.length === 0 ? (
            <div className="text-center py-8 text-green-400">
              No threats detected yet. Submit a URL or email to test the system.
            </div>
          ) : (
            threats.slice(0, 10).map((threat) => (
              <div
                key={threat.id}
                className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800/50 hover:border-green-500/50 transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getRiskColor(threat.risk_level)}`}></div>
                    <span className="text-white font-medium capitalize">{threat.type}</span>
                    <Badge 
                      variant="outline" 
                      className={`${getRiskColor(threat.risk_level)} border-0 text-white text-xs`}
                    >
                      {threat.risk_level}
                    </Badge>
                  </div>
                  <p className="text-green-300 text-sm mt-1 truncate max-w-md">
                    {threat.content}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 text-xs">
                    {new Date(threat.created_at).toLocaleTimeString()}
                  </p>
                  {threat.location && (
                    <p className="text-green-500 text-xs">{threat.location}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
