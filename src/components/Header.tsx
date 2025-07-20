
import { Shield, Bell, Users } from "lucide-react";


export const Header = () => {

  return (
    <header className="bg-black/30 backdrop-blur-lg border-b border-green-500/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Shield className="w-8 h-8 text-green-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">PhishGuard AI</h1>
              <p className="text-sm text-green-400">Community Defense Network</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-green-300">
              <Users className="w-4 h-4" />
              <span className="text-sm">1 Active</span>
            </div>
            
            <div className="relative">
              <Bell className="w-5 h-5 text-green-400 hover:text-green-300 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
