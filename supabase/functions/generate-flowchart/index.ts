
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { workflow, diagramType = 'flowchart' } = await req.json();

    const systemPrompt = `You are an expert at creating flowchart specifications. Generate a detailed flowchart specification in JSON format that can be used to programmatically draw a professional diagram.

The specification should include:
- nodes: array of objects with id, label, type (start, process, decision, end), position (x, y), color
- connections: array of objects with from, to, label (optional)
- layout: overall layout properties

Make the flowchart visually appealing with proper spacing and logical flow.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create a detailed flowchart specification for this workflow: ${workflow}` }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const flowchartSpec = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify({ flowchartSpec }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-flowchart function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
