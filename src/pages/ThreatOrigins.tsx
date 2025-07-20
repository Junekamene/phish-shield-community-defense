
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useState, useEffect } from "react";
import { ArrowLeft, Globe, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ThreatOrigins = () => {
  const navigate = useNavigate();
  const [threatLocations, setThreatLocations] = useState<Array<{
    country: string;
    threats: number;
    percentage: number;
    riskLevels: { [key: string]: number };
  }>>([]);

  useEffect(() => {
    // Process all threat locations
    const locationCounts: { [key: string]: { count: number; risks: { [key: string]: number } } } = {};
    let totalThreats = 0;

    // Mock threat locations data
    const mockCountries = ['Russia', 'China', 'Nigeria', 'United States', 'Brazil', 'India'];
    mockCountries.forEach(country => {
      const count = Math.floor(Math.random() * 15) + 1;
      const risks = {
        critical: Math.floor(Math.random() * 3),
        high: Math.floor(Math.random() * 5),
        medium: Math.floor(Math.random() * 4),
        low: Math.floor(Math.random() * 3)
      };
      
      locationCounts[country] = { count, risks };
      totalThreats += count;
    });

    // Convert to array with detailed risk breakdown
    const locationArray = Object.entries(locationCounts)
      .map(([country, data]) => ({
        country,
        threats: data.count,
        percentage: totalThreats > 0 ? Math.round((data.count / totalThreats) * 100) : 0,
        riskLevels: data.risks
      }))
      .sort((a, b) => b.threats - a.threats);

    setThreatLocations(locationArray);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ff00' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="text-white hover:bg-slate-800/50 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center space-x-3 mb-2">
            <Globe className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Threat Origins</h1>
          </div>
          <p className="text-slate-400">Detailed analysis of threat sources and locations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {threatLocations.length === 0 ? (
            <Card className="bg-black/40 border-purple-500/30 backdrop-blur-lg col-span-full">
              <CardContent className="text-center py-12">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <p className="text-slate-400 text-lg">No threat origin data available</p>
                <p className="text-slate-500 text-sm mt-2">Submit threats for analysis to see origins</p>
              </CardContent>
            </Card>
          ) : (
            threatLocations.map((location, index) => (
              <Card key={index} className="bg-black/40 border-purple-500/30 backdrop-blur-lg hover:border-purple-500/50 transition-all">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-purple-400" />
                      <span>{location.country}</span>
                    </div>
                    <Badge variant="outline" className="border-purple-400 text-purple-400">
                      {location.percentage}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-1">
                      {location.threats}
                    </div>
                    <p className="text-slate-400 text-sm">Total Threats</p>
                  </div>
                  
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${location.percentage}%` }}
                    ></div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-slate-300">Risk Breakdown</h4>
                    {Object.entries(location.riskLevels).map(([risk, count]) => (
                      <div key={risk} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getRiskColor(risk)}`}></div>
                          <span className="text-slate-300 text-sm capitalize">{risk}</span>
                        </div>
                        <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                          {count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {threatLocations.length > 0 && (
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-lg mt-8">
            <CardHeader>
              <CardTitle className="text-white">Summary Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">
                    {threatLocations.length}
                  </div>
                  <p className="text-slate-400 text-sm">Countries</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">
                    {threatLocations.reduce((sum, loc) => sum + loc.threats, 0)}
                  </div>
                  <p className="text-slate-400 text-sm">Total Threats</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {threatLocations[0]?.country || "N/A"}
                  </div>
                  <p className="text-slate-400 text-sm">Top Origin</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {threatLocations[0]?.threats || 0}
                  </div>
                  <p className="text-slate-400 text-sm">Highest Count</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ThreatOrigins;
