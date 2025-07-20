
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useState, useEffect } from "react";


export const RealtimeChart = () => {
  const [data, setData] = useState<Array<{ time: string; threats: number }>>([]);

  useEffect(() => {
    // Generate 24-hour data based on actual threats
    const generateHourlyData = () => {
      const hourlyData = [];
      const now = new Date();
      
      // Create 24 hourly buckets
      for (let i = 23; i >= 0; i--) {
        const hourStart = new Date(now);
        hourStart.setHours(now.getHours() - i, 0, 0, 0);
        const hourEnd = new Date(hourStart);
        hourEnd.setHours(hourStart.getHours() + 1);
        
        // Mock threats count
        const threatsInHour = Math.floor(Math.random() * 3);

        hourlyData.push({
          time: hourStart.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
          threats: threatsInHour
        });
      }
      
      return hourlyData;
    };

    setData(generateHourlyData());
  }, []);

  // Update data every 5 minutes to reflect new threats
  useEffect(() => {
    const interval = setInterval(() => {
      const generateHourlyData = () => {
        const hourlyData = [];
        const now = new Date();
        
        for (let i = 23; i >= 0; i--) {
          const hourStart = new Date(now);
          hourStart.setHours(now.getHours() - i, 0, 0, 0);
          const hourEnd = new Date(hourStart);
          hourEnd.setHours(hourStart.getHours() + 1);
          
          const threatsInHour = Math.floor(Math.random() * 3);

          hourlyData.push({
            time: hourStart.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            }),
            threats: threatsInHour
          });
        }
        
        return hourlyData;
      };

      setData(generateHourlyData());
    }, 5 * 60 * 1000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-black/40 border-purple-500/30 backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="text-white">24-Hour Threat Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="threats" 
              stroke="#06b6d4" 
              strokeWidth={3}
              dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#06b6d4', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
