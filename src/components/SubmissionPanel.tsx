
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import { CloudUpload, AlertTriangle, CheckCircle, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const SubmissionPanel = () => {
  const [urlInput, setUrlInput] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [communityUrl, setCommunityUrl] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastResult, setLastResult] = useState<{ type: string; risk: string; details: string } | null>(null);
  
  
  const { toast } = useToast();

  const analyzeUrl = async () => {
    if (!urlInput.trim()) return;
    
    setIsAnalyzing(true);
    console.log("Analyzing URL:", urlInput);
    
    try {
      // Mock analysis
      const risks = ['low', 'medium', 'high', 'critical'];
      const randomRisk = risks[Math.floor(Math.random() * risks.length)];
      
      setLastResult({
        type: "URL Analysis",
        risk: randomRisk,
        details: "Mock analysis complete"
      });

      toast({
        title: "URL Analysis Complete",
        description: `Risk Level: ${randomRisk.toUpperCase()}`,
        variant: randomRisk === 'high' || randomRisk === 'critical' ? "destructive" : "default"
      });
      
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze URL. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      setUrlInput("");
    }
  };

  const analyzeEmail = async () => {
    if (!emailContent.trim()) return;
    
    setIsAnalyzing(true);
    console.log("Analyzing email content");
    
    try {
      // Mock analysis
      const risks = ['low', 'medium', 'high', 'critical'];
      const randomRisk = risks[Math.floor(Math.random() * risks.length)];
      
      setLastResult({
        type: "Email Analysis",
        risk: randomRisk,
        details: "Mock analysis complete"
      });

      toast({
        title: "Email Analysis Complete",
        description: `Risk Level: ${randomRisk.toUpperCase()}`,
        variant: randomRisk === 'high' || randomRisk === 'critical' ? "destructive" : "default"
      });
      
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      setEmailContent("");
    }
  };

  const handleCommunitySubmission = async () => {
    if (!communityUrl.trim() || !communityDescription.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      // Mock submission
      toast({
        title: "Report Submitted",
        description: "Thank you for contributing to community safety!",
      });
      
      setCommunityUrl("");
      setCommunityDescription("");
    } catch (error) {
      console.error('Submission failed:', error);
      toast({
        title: "Submission Failed",
        description: "Unable to submit report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "low": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "medium": return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "high": 
      case "critical": return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "border-green-400 text-green-400";
      case "medium": return "border-yellow-400 text-yellow-400";
      case "high": return "border-orange-400 text-orange-400";
      case "critical": return "border-red-400 text-red-400";
      default: return "border-gray-400 text-gray-400";
    }
  };

  return (
    <Card className="bg-black/40 border-purple-500/30 backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <CloudUpload className="w-5 h-5 text-cyan-400" />
          <span>Threat Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="url" className="data-[state=active]:bg-purple-600">URL Scanner</TabsTrigger>
            <TabsTrigger value="email" className="data-[state=active]:bg-purple-600">Email Analysis</TabsTrigger>
            <TabsTrigger value="community" className="data-[state=active]:bg-purple-600">Report Threat</TabsTrigger>
          </TabsList>
          
          <TabsContent value="url" className="space-y-4">
            <div className="space-y-3">
              <Input
                placeholder="Enter suspicious URL (e.g., https://suspicious-site.com)"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
              />
              <Button
                onClick={analyzeUrl}
                disabled={isAnalyzing || !urlInput.trim()}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze URL"
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="space-y-4">
            <div className="space-y-3">
              <Textarea
                placeholder="Paste email content here for phishing analysis..."
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 min-h-24"
              />
              <Button
                onClick={analyzeEmail}
                disabled={isAnalyzing || !emailContent.trim()}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Email"
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-4">
            <div className="space-y-3">
              <Input
                placeholder="Suspicious URL to report"
                value={communityUrl}
                onChange={(e) => setCommunityUrl(e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
              />
              <Textarea
                placeholder="Describe the threat (how you encountered it, what makes it suspicious...)"
                value={communityDescription}
                onChange={(e) => setCommunityDescription(e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 min-h-20"
              />
              <Button
                onClick={handleCommunitySubmission}
                disabled={isAnalyzing || !communityUrl.trim() || !communityDescription.trim()}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Report"
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {lastResult && (
          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-medium">{lastResult.type} Complete</h3>
              <Badge variant="outline" className={getRiskColor(lastResult.risk)}>
                {getRiskIcon(lastResult.risk)}
                <span className="ml-1 capitalize">{lastResult.risk} Risk</span>
              </Badge>
            </div>
            <p className="text-slate-300 text-sm">{lastResult.details}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
