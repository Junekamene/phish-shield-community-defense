
import { Shield, Bell, Users } from "lucide-react";
import { useThreat } from "@/context/ThreatContext";

export const Header = () => {
  const { stats, alerts } = useThreat();

  return (
    <header className="bg-black/20 backdrop-blur-lg border-b border-purple-500/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Shield className="w-8 h-8 text-cyan-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">PhishGuard AI</h1>
              <p className="text-sm text-slate-400">Community Defense Network</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-slate-300">
              <Users className="w-4 h-4" />
              <span className="text-sm">{stats.activeUsers} Active</span>
            </div>
            
            <div className="relative">
              <Bell className="w-5 h-5 text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors" />
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {alerts.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
