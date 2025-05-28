
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Users, Zap, Globe, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ff00' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative z-10">
        {/* Header */}
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
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent mb-6">
              PhishGuard AI
            </h1>
            <p className="text-xl md:text-2xl text-green-200 mb-4">
              Advanced Phishing Detection & Community Defense Platform
            </p>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Protect yourself and your organization from phishing attacks with AI-powered detection, 
              real-time analytics, and community-driven threat intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                  Start Protecting Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10 px-8 py-3">
                  Access Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-black/40 backdrop-blur-lg border border-green-500/30 rounded-lg p-6 text-center">
              <Zap className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Real-Time Detection</h3>
              <p className="text-gray-400">
                AI-powered scanning instantly identifies phishing attempts in emails and URLs
              </p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-lg border border-green-500/30 rounded-lg p-6 text-center">
              <Users className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Community Defense</h3>
              <p className="text-gray-400">
                Crowdsourced threat intelligence from security professionals worldwide
              </p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-lg border border-green-500/30 rounded-lg p-6 text-center">
              <Globe className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Global Protection</h3>
              <p className="text-gray-400">
                Monitor threats across regions with interactive threat maps and analytics
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
