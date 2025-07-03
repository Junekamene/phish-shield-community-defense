
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Canvas as FabricCanvas, Rect, Circle, Text, Line } from "fabric";
import { Loader, Wand2, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FlowchartNode {
  id: string;
  label: string;
  type: 'start' | 'process' | 'decision' | 'end';
  position: { x: number; y: number };
  color: string;
}

interface FlowchartConnection {
  from: string;
  to: string;
  label?: string;
}

interface FlowchartSpec {
  nodes: FlowchartNode[];
  connections: FlowchartConnection[];
  layout: {
    width: number;
    height: number;
  };
}

export const AIFlowchartGenerator = () => {
  const [workflowText, setWorkflowText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [flowchartSpec, setFlowchartSpec] = useState<FlowchartSpec | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const { toast } = useToast();

  // Default PhishGuard AI workflow
  const defaultWorkflow = `PhishGuard AI Workflow:
1. User Submission → Users submit suspicious URLs or email content
2. Content Validation → System validates input format
3. AI Engine Activation → Comprehensive AI analysis triggers
4. Pattern Recognition → Analyze suspicious keywords and structures
5. Risk Classification → Assign risk levels (low, medium, high, critical)
6. Community Reporting → Users flag suspicious content
7. Peer Review → Community votes on threat authenticity
8. Data Processing → Merge AI detections with community reports
9. Real-time Analytics → Update dashboards and visualizations
10. Alert Generation → Trigger notifications for critical threats
11. Automated Blocking → Block verified suspicious threats
12. Continuous Learning → AI improves through feedback`;

  useEffect(() => {
    setWorkflowText(defaultWorkflow);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 1200,
      height: 800,
      backgroundColor: "#0f172a",
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  const generateFlowchart = async () => {
    if (!workflowText.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-flowchart', {
        body: { workflow: workflowText }
      });

      if (error) throw error;

      setFlowchartSpec(data.flowchartSpec);
      drawFlowchart(data.flowchartSpec);
      
      toast({
        title: "Flowchart Generated!",
        description: "AI has created your workflow diagram",
      });
      
    } catch (error) {
      console.error('Generation failed:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate flowchart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const drawFlowchart = async (spec: FlowchartSpec) => {
    if (!fabricCanvas) return;

    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#0f172a";

    // Draw nodes
    for (const node of spec.nodes) {
      let shape;
      
      if (node.type === 'start' || node.type === 'end') {
        // Oval shape for start/end
        shape = new Circle({
          left: node.position.x,
          top: node.position.y,
          radius: 40,
          fill: node.color || '#22c55e',
          stroke: '#ffffff',
          strokeWidth: 2,
        });
      } else if (node.type === 'decision') {
        // Diamond shape for decisions (using rotated rectangle)
        shape = new Rect({
          left: node.position.x,
          top: node.position.y,
          width: 80,
          height: 80,
          fill: node.color || '#f59e0b',
          stroke: '#ffffff',
          strokeWidth: 2,
          angle: 45,
        });
      } else {
        // Rectangle for processes
        shape = new Rect({
          left: node.position.x,
          top: node.position.y,
          width: 120,
          height: 60,
          fill: node.color || '#3b82f6',
          stroke: '#ffffff',
          strokeWidth: 2,
          rx: 8,
          ry: 8,
        });
      }

      fabricCanvas.add(shape);

      // Add text label
      const text = new Text(node.label, {
        left: node.position.x + (node.type === 'decision' ? 0 : 60),
        top: node.position.y + (node.type === 'start' || node.type === 'end' ? 0 : 30),
        fontSize: 12,
        fill: 'white',
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
        fontFamily: 'Inter, sans-serif',
      });

      fabricCanvas.add(text);
    }

    // Draw connections
    for (const connection of spec.connections) {
      const fromNode = spec.nodes.find(n => n.id === connection.from);
      const toNode = spec.nodes.find(n => n.id === connection.to);
      
      if (fromNode && toNode) {
        const line = new Line([
          fromNode.position.x + 60,
          fromNode.position.y + 30,
          toNode.position.x + 60,
          toNode.position.y + 30
        ], {
          stroke: '#64748b',
          strokeWidth: 2,
          selectable: false,
        });

        fabricCanvas.add(line);

        if (connection.label) {
          const labelText = new Text(connection.label, {
            left: (fromNode.position.x + toNode.position.x) / 2 + 60,
            top: (fromNode.position.y + toNode.position.y) / 2 + 30,
            fontSize: 10,
            fill: '#64748b',
            textAlign: 'center',
            originX: 'center',
            originY: 'center',
            fontFamily: 'Inter, sans-serif',
          });

          fabricCanvas.add(labelText);
        }
      }
    }

    fabricCanvas.renderAll();
  };

  const downloadFlowchart = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
    });
    
    const link = document.createElement('a');
    link.download = 'phishguard-ai-flowchart.png';
    link.href = dataURL;
    link.click();
    
    toast({
      title: "Downloaded!",
      description: "Flowchart saved as PNG image",
    });
  };

  return (
    <Card className="bg-black/40 border-purple-500/30 backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Wand2 className="w-5 h-5 text-purple-400" />
          <span>AI Flowchart Generator</span>
          <Badge variant="outline" className="border-purple-400 text-purple-400">
            GPT-4 Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">
            Workflow Description
          </label>
          <Textarea
            placeholder="Describe your workflow steps..."
            value={workflowText}
            onChange={(e) => setWorkflowText(e.target.value)}
            className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 min-h-32"
          />
          <div className="flex gap-3">
            <Button
              onClick={generateFlowchart}
              disabled={isGenerating || !workflowText.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isGenerating ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Flowchart
                </>
              )}
            </Button>
            
            <Button
              onClick={() => setWorkflowText(defaultWorkflow)}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800/50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Load Default
            </Button>

            {flowchartSpec && (
              <Button
                onClick={downloadFlowchart}
                variant="outline"
                className="border-green-600 text-green-400 hover:bg-green-800/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PNG
              </Button>
            )}
          </div>
        </div>

        <div className="border border-slate-600 rounded-lg overflow-hidden">
          <canvas 
            ref={canvasRef} 
            className="w-full max-w-full" 
            style={{ maxHeight: '600px' }}
          />
        </div>

        {flowchartSpec && (
          <div className="text-center">
            <Badge variant="outline" className="border-green-400 text-green-400">
              ✨ AI-Generated Flowchart Ready
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
