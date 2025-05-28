
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useThreat } from "@/context/ThreatContext";
import { Shield, AlertTriangle, CheckCircle, Users } from "lucide-react";

export const ThreatMetrics = () => {
  const { stats } = useThreat();

  const metrics = [
    {
      title: "Total Threats Blocked",
      value: stats.totalThreats.toLocaleString(),
      icon: Shield,
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/10"
    },
    {
      title: "Blocked Today",
      value: stats.blockedToday.toString(),
      icon: AlertTriangle,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10"
    },
    {
      title: "Detection Accuracy",
      value: `${stats.accuracy.toFixed(1)}%`,
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-400/10"
    },
    {
      title: "Active Community",
      value: stats.activeUsers.toString(),
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-black/40 border-purple-500/30 backdrop-blur-lg hover:border-purple-500/50 transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center justify-between">
              {metric.title}
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${metric.color} mb-1`}>
              {metric.value}
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-400">Live</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
