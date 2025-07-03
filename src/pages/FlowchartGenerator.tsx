
import { AIFlowchartGenerator } from "@/components/AIFlowchartGenerator";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FlowchartGenerator = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ff00' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative z-10">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              className="text-slate-400 hover:text-white hover:bg-slate-800/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                AI Flowchart Generator
              </h1>
              <p className="text-slate-300 text-lg">
                Transform your workflow descriptions into professional flowcharts using AI
              </p>
            </div>
            
            <AIFlowchartGenerator />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowchartGenerator;
