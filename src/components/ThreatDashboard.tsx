import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { ThreatMetrics } from "./ThreatMetrics";
import { ThreatMap } from "./ThreatMap";
import { RealtimeChart } from "./RealtimeChart";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { Wand2 } from "lucide-react";

export const ThreatDashboard = () => {
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
          <div className="text-center py-8 text-green-400">
            PhishGuard AI Dashboard - Ready for threat detection
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
