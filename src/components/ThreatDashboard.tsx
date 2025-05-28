
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useThreat } from "@/context/ThreatContext";
import { ThreatMetrics } from "./ThreatMetrics";
import { ThreatMap } from "./ThreatMap";
import { RealtimeChart } from "./RealtimeChart";

export const ThreatDashboard = () => {
  const { threats, stats } = useThreat();

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <ThreatMetrics />
      
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
          {threats.slice(0, 10).map((threat) => (
            <div
              key={threat.id}
              className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800/50 hover:border-green-500/50 transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getRiskColor(threat.riskLevel)}`}></div>
                  <span className="text-white font-medium capitalize">{threat.type}</span>
                  <Badge 
                    variant="outline" 
                    className={`${getRiskColor(threat.riskLevel)} border-0 text-white text-xs`}
                  >
                    {threat.riskLevel}
                  </Badge>
                </div>
                <p className="text-green-300 text-sm mt-1 truncate max-w-md">
                  {threat.content}
                </p>
              </div>
              <div className="text-right">
                <p className="text-green-400 text-xs">
                  {threat.timestamp.toLocaleTimeString()}
                </p>
                {threat.location && (
                  <p className="text-green-500 text-xs">{threat.location}</p>
                )}
              </div>
            </div>
          ))}
          {threats.length === 0 && (
            <div className="text-center py-8 text-green-400">
              No threats detected yet. Submit a URL or email to test the system.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
