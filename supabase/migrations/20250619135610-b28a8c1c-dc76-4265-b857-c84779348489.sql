
-- Create enum for threat types
CREATE TYPE threat_type AS ENUM ('url', 'email', 'community', 'ai_detected');

-- Create enum for risk levels
CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high', 'critical');

-- Create threats table to store all threat detections
CREATE TABLE public.threats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type threat_type NOT NULL,
  content TEXT NOT NULL,
  risk_level risk_level NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  votes INTEGER DEFAULT 0,
  location TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community reports table
CREATE TABLE public.community_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  threat_id UUID REFERENCES public.threats(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  votes INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create threat analytics table for metrics
CREATE TABLE public.threat_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_threats INTEGER DEFAULT 0,
  critical_threats INTEGER DEFAULT 0,
  high_threats INTEGER DEFAULT 0,
  medium_threats INTEGER DEFAULT 0,
  low_threats INTEGER DEFAULT 0,
  blocked_attacks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.threats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for threats
CREATE POLICY "Users can view all threats" ON public.threats FOR SELECT USING (true);
CREATE POLICY "Users can insert their own threats" ON public.threats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own threats" ON public.threats FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for community reports
CREATE POLICY "Users can view all community reports" ON public.community_reports FOR SELECT USING (true);
CREATE POLICY "Users can insert their own reports" ON public.community_reports FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for threat analytics (public read)
CREATE POLICY "Anyone can view threat analytics" ON public.threat_analytics FOR SELECT USING (true);

-- Create RLS policies for alerts
CREATE POLICY "Users can view their own alerts" ON public.alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own alerts" ON public.alerts FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update threat analytics
CREATE OR REPLACE FUNCTION update_threat_analytics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.threat_analytics (
    date,
    total_threats,
    critical_threats,
    high_threats,
    medium_threats,
    low_threats
  )
  VALUES (
    CURRENT_DATE,
    1,
    CASE WHEN NEW.risk_level = 'critical' THEN 1 ELSE 0 END,
    CASE WHEN NEW.risk_level = 'high' THEN 1 ELSE 0 END,
    CASE WHEN NEW.risk_level = 'medium' THEN 1 ELSE 0 END,
    CASE WHEN NEW.risk_level = 'low' THEN 1 ELSE 0 END
  )
  ON CONFLICT (date) DO UPDATE SET
    total_threats = threat_analytics.total_threats + 1,
    critical_threats = threat_analytics.critical_threats + CASE WHEN NEW.risk_level = 'critical' THEN 1 ELSE 0 END,
    high_threats = threat_analytics.high_threats + CASE WHEN NEW.risk_level = 'high' THEN 1 ELSE 0 END,
    medium_threats = threat_analytics.medium_threats + CASE WHEN NEW.risk_level = 'medium' THEN 1 ELSE 0 END,
    low_threats = threat_analytics.low_threats + CASE WHEN NEW.risk_level = 'low' THEN 1 ELSE 0 END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update analytics
CREATE TRIGGER threat_analytics_trigger
  AFTER INSERT ON public.threats
  FOR EACH ROW EXECUTE FUNCTION update_threat_analytics();
