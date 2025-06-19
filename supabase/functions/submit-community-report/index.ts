
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

    const { url, description } = await req.json()

    // Get user from auth
    const { data: { user } } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error('User not authenticated')
    }

    // First create a threat entry
    const { data: threat, error: threatError } = await supabaseClient
      .from('threats')
      .insert({
        user_id: user.id,
        type: 'community',
        content: `${url} - ${description}`,
        risk_level: 'medium', // Default for community reports
        verified: false,
        votes: 1,
        location: 'Community Report'
      })
      .select()
      .single()

    if (threatError) throw threatError

    // Then create the community report
    const { data: report, error: reportError } = await supabaseClient
      .from('community_reports')
      .insert({
        user_id: user.id,
        threat_id: threat.id,
        url: url,
        votes: 1,
        status: 'pending'
      })
      .select()
      .single()

    if (reportError) throw reportError

    return new Response(JSON.stringify({ report, threat }), {
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
