
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router-dom";
import { Shield, AlertTriangle, Users } from "lucide-react";
import { useState, useEffect } from "react";
// Mock threat metrics

export const ThreatMetrics = () => {
  const navigate = useNavigate();
  const [showBlockedThreats, setShowBlockedThreats] = useState(false);

  const handleTotalThreatsClick = () => {
    setShowBlockedThreats(!showBlockedThreats);
  };

  const handleBlockedTodayClick = () => {
    navigate('/blocked-threats');
  };

  const metrics = [
    {
      title: "Total Threats Blocked",
      value: "0",
      icon: Shield,
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/10",
      onClick: handleTotalThreatsClick,
      clickable: true
    },
    {
      title: "Blocked Today",
      value: "0",
      icon: AlertTriangle,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
      onClick: handleBlockedTodayClick,
      clickable: true
    },
    {
      title: "Active Community",
      value: "1",
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
            <div className="text-center py-8 text-slate-400">
              <Shield className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p>No high-risk threats blocked yet</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
