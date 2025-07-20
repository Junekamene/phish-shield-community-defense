
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

// Mock community reports
import { Users, Flag, CheckCircle } from "lucide-react";

interface CommunityReport {
  id: string;
  url: string;
  votes: number;
  status: string;
  created_at: string;
}

export const CommunityReports = () => {
  const [reportUrl, setReportUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [communityReports, setCommunityReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(true);
  

  const fetchCommunityReports = async () => {
    try {
      // Mock community reports data
      const mockReports = [
        {
          id: "1",
          url: "https://suspicious-site.com",
          votes: 15,
          status: "verified",
          created_at: new Date().toISOString()
        },
        {
          id: "2", 
          url: "https://fake-bank.net",
          votes: 8,
          status: "pending",
          created_at: new Date(Date.now() - 3600000).toISOString()
        }
      ];

      setCommunityReports(mockReports);
    } catch (error) {
      console.error('Error fetching community reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityReports();
  }, []);

  const handleSubmitReport = async () => {
    if (!reportUrl.trim()) return;
    
    setIsSubmitting(true);
    console.log("Submitting community report:", reportUrl, description);
    
    try {
      // Mock submission
      setReportUrl("");
      setDescription("");
    } catch (error) {
      console.error('Error submitting community report:', error);
    } finally {
      setIsSubmitting(false);
    }
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
          <Textarea
            placeholder="Optional: Describe the threat (e.g., phishing, malware)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 min-h-[60px]"
          />
          <Button
            onClick={handleSubmitReport}
            disabled={isSubmitting || !reportUrl.trim()}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Flag className="w-4 h-4 mr-2" />
            {isSubmitting ? "Submitting..." : "Report Threat"}
          </Button>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Recent Community Reports</h4>
          {loading ? (
            <div className="text-center py-4 text-slate-400">
              Loading community reports...
            </div>
          ) : communityReports.length === 0 ? (
            <div className="text-center py-4 text-slate-400">
              No community reports yet. Be the first to report a threat!
            </div>
          ) : (
            communityReports.map((report) => (
              <div
                key={report.id}
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
                    <span className="text-xs text-slate-500">
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
