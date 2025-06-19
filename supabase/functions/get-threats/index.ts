
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const url = new URL(req.url)
    const limit = url.searchParams.get('limit') || '50'
    const offset = url.searchParams.get('offset') || '0'

    // Get recent threats
    const { data: threats, error } = await supabaseClient
      .from('threats')
      .select('*')
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

    if (error) throw error

    // Get threat analytics
    const { data: analytics, error: analyticsError } = await supabaseClient
      .from('threat_analytics')
      .select('*')
      .order('date', { ascending: false })
      .limit(1)
      .single()

    if (analyticsError && analyticsError.code !== 'PGRST116') {
      console.error('Analytics error:', analyticsError)
    }

    const stats = {
      totalThreats: analytics?.total_threats || 0,
      blockedToday: analytics?.blocked_attacks || 0,
      criticalThreats: analytics?.critical_threats || 0,
      highThreats: analytics?.high_threats || 0,
      accuracy: 94.7, // Static for now
      activeUsers: 342 // Static for now
    }

    return new Response(JSON.stringify({ threats, stats }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
