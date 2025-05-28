
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const ThreatMap = () => {
  const threatLocations = [
    { country: "United States", threats: 45, percentage: 35 },
    { country: "Russia", threats: 28, percentage: 22 },
    { country: "China", threats: 22, percentage: 17 },
    { country: "Nigeria", threats: 15, percentage: 12 },
    { country: "Brazil", threats: 12, percentage: 9 },
    { country: "Others", threats: 6, percentage: 5 }
  ];

  return (
    <Card className="bg-black/40 border-purple-500/30 backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="text-white">Threat Origins</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {threatLocations.map((location, index) => (
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
        ))}
      </CardContent>
    </Card>
  );
};
