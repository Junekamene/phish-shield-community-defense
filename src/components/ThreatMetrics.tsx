
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useThreat } from "@/context/ThreatContext";
import { useNavigate } from "react-router-dom";
import { Shield, AlertTriangle, Users } from "lucide-react";
import { useState, useEffect } from "react";

export const ThreatMetrics = () => {
  const { threats, stats } = useThreat();
  const navigate = useNavigate();
  const [blockedThreats, setBlockedThreats] = useState<any[]>([]);
  const [blockedToday, setBlockedToday] = useState(0);
  const [showBlockedThreats, setShowBlockedThreats] = useState(false);

  useEffect(() => {
    // Filter threats that are high or critical risk (automatically blocked)
    const blocked = threats.filter(threat => 
      threat.risk_level === 'high' || threat.risk_level === 'critical'
    );
    setBlockedThreats(blocked);

    // Count threats blocked today
    const today = new Date().toDateString();
    const todayBlocked = blocked.filter(threat => {
      const threatDate = new Date(threat.created_at).toDateString();
      return today === threatDate;
    });
    setBlockedToday(todayBlocked.length);
  }, [threats]);

  const handleTotalThreatsClick = () => {
    setShowBlockedThreats(!showBlockedThreats);
  };

  const handleBlockedTodayClick = () => {
    navigate('/blocked-threats');
  };

  const metrics = [
    {
      title: "Total Threats Blocked",
      value: blockedThreats.length.toString(),
      icon: Shield,
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/10",
      onClick: handleTotalThreatsClick,
      clickable: true
    },
    {
      title: "Blocked Today",
      value: blockedToday.toString(),
      icon: AlertTriangle,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
      onClick: handleBlockedTodayClick,
      clickable: true
    },
    {
      title: "Active Community",
      value: stats.activeUsers.toString(),
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      clickable: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-slate-400">Live</span>
                </div>
                {metric.clickable && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={metric.onClick}
                    className="text-xs text-slate-400 hover:text-white hover:bg-slate-800/50 p-1 h-6"
                  >
                    View
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showBlockedThreats && (
        <Card className="bg-black/60 border-cyan-500/30 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <span>Recently Blocked Threats</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBlockedThreats(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {blockedThreats.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Shield className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                <p>No high-risk threats blocked yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {blockedThreats.slice(0, 5).map((threat) => (
                  <div
                    key={threat.id}
                    className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          threat.risk_level === 'critical' ? 'bg-red-500' : 'bg-orange-500'
                        }`}></div>
                        <span className="text-white font-medium capitalize">{threat.type}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          threat.risk_level === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                        }`}>
                          {threat.risk_level.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm mt-1 truncate max-w-md">
                        {threat.content}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-cyan-400 text-xs">
                        {threat.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {blockedThreats.length > 5 && (
                  <div className="text-center pt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBlockedTodayClick}
                      className="text-cyan-400 hover:text-white hover:bg-slate-800/50"
                    >
                      View All ({blockedThreats.length} total)
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
