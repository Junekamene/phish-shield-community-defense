
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

    const { content, type } = await req.json()

    // Simple AI-like analysis simulation
    const riskFactors = []
    let riskScore = 0

    // URL analysis
    if (type === 'url') {
      if (content.includes('bit.ly') || content.includes('tinyurl')) riskFactors.push('Shortened URL'), riskScore += 20
      if (content.includes('secure') || content.includes('update')) riskFactors.push('Suspicious keywords'), riskScore += 15
      if (!content.startsWith('https://')) riskFactors.push('Non-HTTPS'), riskScore += 25
      if (content.includes('.tk') || content.includes('.ml')) riskFactors.push('Suspicious TLD'), riskScore += 30
    }

    // Email analysis
    if (type === 'email') {
      if (content.toLowerCase().includes('urgent') || content.toLowerCase().includes('immediate')) riskFactors.push('Urgency tactics'), riskScore += 20
      if (content.includes('click here') || content.includes('verify now')) riskFactors.push('Phishing language'), riskScore += 25
      if (content.includes('suspend') || content.includes('locked')) riskFactors.push('Account threats'), riskScore += 30
      if (content.includes('$') || content.includes('prize')) riskFactors.push('Financial incentives'), riskScore += 15
    }

    // Determine risk level
    let riskLevel = 'low'
    if (riskScore >= 60) riskLevel = 'critical'
    else if (riskScore >= 40) riskLevel = 'high'
    else if (riskScore >= 20) riskLevel = 'medium'

    // Get user from auth
    const { data: { user } } = await supabaseClient.auth.getUser()

    // Insert threat into database
    const { data: threat, error } = await supabaseClient
      .from('threats')
      .insert({
        user_id: user?.id,
        type: type,
        content: content.substring(0, 500), // Limit content length
        risk_level: riskLevel,
        verified: true,
        votes: 0,
        location: 'API Detection',
        metadata: { riskFactors, riskScore }
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    // Create alert for high-risk threats
    if (riskLevel === 'high' || riskLevel === 'critical') {
      await supabaseClient
        .from('alerts')
        .insert({
          user_id: user?.id,
          type: 'threat_detected',
          message: `${riskLevel.toUpperCase()} THREAT DETECTED: ${type} submission flagged`
        })
    }

    const response = {
      threat,
      analysis: {
        riskLevel,
        riskScore,
        riskFactors,
        recommendation: riskLevel === 'critical' ? 'DO NOT INTERACT - Block immediately' :
                       riskLevel === 'high' ? 'DANGEROUS - Avoid interaction' :
                       riskLevel === 'medium' ? 'SUSPICIOUS - Exercise caution' :
                       'APPEARS SAFE - Monitor activity'
      }
    }

    return new Response(JSON.stringify(response), {
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
