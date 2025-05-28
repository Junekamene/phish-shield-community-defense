
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useThreat } from "@/context/ThreatContext";
import { Users, Flag, CheckCircle } from "lucide-react";

export const CommunityReports = () => {
  const [reportUrl, setReportUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addThreat } = useThreat();

  const communityReports = [
    { url: "fake-bank-login.net", votes: 23, status: "verified" },
    { url: "phishing-paypal.com", votes: 18, status: "pending" },
    { url: "malicious-update.org", votes: 31, status: "verified" },
    { url: "fake-microsoft.net", votes: 12, status: "pending" }
  ];

  const submitCommunityReport = async () => {
    if (!reportUrl.trim()) return;
    
    setIsSubmitting(true);
    console.log("Submitting community report:", reportUrl);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addThreat({
      type: "community",
      content: reportUrl,
      riskLevel: "medium",
      verified: false,
      votes: 1,
      location: "Community Report"
    });
    
    setIsSubmitting(false);
    setReportUrl("");
  };

  return (
    <Card className="bg-black/40 border-purple-500/30 backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Users className="w-5 h-5 text-purple-400" />
          <span>Community Defense</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Input
            placeholder="Report suspicious URL to community"
            value={reportUrl}
            onChange={(e) => setReportUrl(e.target.value)}
            className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
          />
          <Button
            onClick={submitCommunityReport}
            disabled={isSubmitting || !reportUrl.trim()}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Flag className="w-4 h-4 mr-2" />
            {isSubmitting ? "Submitting..." : "Report Threat"}
          </Button>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Recent Community Reports</h4>
          {communityReports.map((report, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-slate-800/30 rounded border border-slate-700/50"
            >
              <div className="flex-1">
                <p className="text-white text-sm truncate">{report.url}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-slate-400">{report.votes} votes</span>
                  <Badge 
                    variant="outline" 
                    className={report.status === "verified" 
                      ? "border-green-400 text-green-400" 
                      : "border-yellow-400 text-yellow-400"
                    }
                  >
                    {report.status === "verified" && <CheckCircle className="w-3 h-3 mr-1" />}
                    {report.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
