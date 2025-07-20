
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, AlertTriangle, Calendar } from "lucide-react";


const BlockedThreats = () => {
  const navigate = useNavigate();
  const [blockedThreats, setBlockedThreats] = useState<any[]>([]);

  useEffect(() => {
    // Mock blocked threats
    setBlockedThreats([]);
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical": return "bg-red-500 border-red-400 text-red-100";
      case "high": return "bg-orange-500 border-orange-400 text-orange-100";
      default: return "bg-gray-500 border-gray-400 text-gray-100";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const todayBlocked = blockedThreats.filter(threat => {
    const today = new Date().toDateString();
    const threatDate = new Date(threat.created_at).toDateString();
    return today === threatDate;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ff00' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            className="text-white hover:bg-slate-800/50 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="w-8 h-8 text-red-400" />
            <h1 className="text-3xl font-bold text-white">Blocked Threats History</h1>
          </div>
          <p className="text-slate-400">All high and critical risk threats automatically blocked by PhishGuard AI</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-black/40 border-red-500/30 backdrop-blur-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Blocked</p>
                  <p className="text-2xl font-bold text-red-400">{blockedThreats.length}</p>
                </div>
                <Shield className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-orange-500/30 backdrop-blur-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Blocked Today</p>
                  <p className="text-2xl font-bold text-orange-400">{todayBlocked.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-yellow-500/30 backdrop-blur-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Critical Threats</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {blockedThreats.filter(t => t.risk_level === 'critical').length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-black/60 border-red-500/30 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Shield className="w-5 h-5 text-red-400" />
              <span>Blocked Threats Log</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {blockedThreats.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Shield className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <p className="text-lg">No threats blocked yet</p>
                <p className="text-sm">High and critical risk threats will appear here when detected</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {blockedThreats.map((threat) => (
                  <div
                    key={threat.id}
                    className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getRiskColor(threat.risk_level).split(' ')[0]}`}></div>
                        <span className="text-white font-medium capitalize">{threat.type}</span>
                        <Badge className={getRiskColor(threat.risk_level)}>
                          {threat.risk_level.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="border-red-400 text-red-400">
                          BLOCKED
                        </Badge>
                      </div>
                      <p className="text-slate-300 text-sm truncate max-w-md mb-1">
                        {threat.content}
                      </p>
                      <p className="text-slate-500 text-xs">
                        {threat.location} • {formatDate(threat.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlockedThreats;
