import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useThreat } from "@/context/ThreatContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";

export const ThreatMap = () => {
  const { threats } = useThreat();
  const navigate = useNavigate();
  const [threatLocations, setThreatLocations] = useState<Array<{
    country: string;
    threats: number;
    percentage: number;
  }>>([]);

  useEffect(() => {
    // Extract and process threat locations from the database
    const locationCounts: { [key: string]: number } = {};
    let totalThreats = 0;

    threats.forEach(threat => {
      if (threat.location && threat.location !== 'API Detection' && threat.location !== 'Community Report') {
        // Extract country from location or use the location as country
        const country = threat.location.includes(',') 
          ? threat.location.split(',').pop()?.trim() || threat.location
          : threat.location;
        
        locationCounts[country] = (locationCounts[country] || 0) + 1;
        totalThreats++;
      }
    });

    // Convert to array and calculate percentages
    const locationArray = Object.entries(locationCounts)
      .map(([country, count]) => ({
        country,
        threats: count,
        percentage: totalThreats > 0 ? Math.round((count / totalThreats) * 100) : 0
      }))
      .sort((a, b) => b.threats - a.threats)
      .slice(0, 6); // Show top 6 locations

    // If we have less than 6 locations and there are other threats, add "Others"
    const displayedThreats = locationArray.reduce((sum, loc) => sum + loc.threats, 0);
    if (locationArray.length < 6 && displayedThreats < totalThreats) {
      const othersCount = totalThreats - displayedThreats;
      locationArray.push({
        country: "Others",
        threats: othersCount,
        percentage: Math.round((othersCount / totalThreats) * 100)
      });
    }

    setThreatLocations(locationArray);
  }, [threats]);

  const handleViewAllOrigins = () => {
    navigate('/threat-origins');
  };

  return (
    <Card className="bg-black/40 border-purple-500/30 backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Threat Origins</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewAllOrigins}
            className="text-slate-400 hover:text-white hover:bg-slate-800/50 p-2 h-8"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {threatLocations.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <div className="w-12 h-12 mx-auto mb-3 bg-slate-700 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
            </div>
            <p>No threat origin data available</p>
            <p className="text-xs mt-1">Submit threats for analysis to see origins</p>
          </div>
        ) : (
          threatLocations.map((location, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
                <span className="text-slate-300 font-medium">{location.country}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${location.percentage}%` }}
                  ></div>
                </div>
                <Badge variant="outline" className="border-red-400 text-red-400 text-xs">
                  {location.threats}
                </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
