import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  // CORS Headers allow your website to talk to this function
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json'
  }

  // Handle preflight request from the browser
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers })
  }

  try {
    const { email, hub } = await req.json()

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Moe @ RadMatch <contact@radmatch.app>',
        to: email,
        subject: `You're officially a Founding Member of RadMatch ${hub ? 'in ' + hub : ''} ☢️`,
        html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; border: 1px solid #eaeaef;">
  <div style="text-align: center; margin-bottom: 30px;">
    <img src="https://radmatch.app/logo-zoomed.png" alt="RadMatch Logo" style="max-height: 100px; width: auto;">
  </div>
  <p style="font-size: 16px;">Hey there,</p>
  <p style="font-size: 16px;">You're in. Welcome to the inner circle.</p>
  <p style="font-size: 16px;">I started building RadMatch because, let's be honest—the imaging world is a small circle, but it can feel pretty lonely when you're the only one on call or staring at a monitor in a dark room all night.</p>
  <p style="font-size: 16px;">You are officially one of our <strong>Founding Members</strong>. We're currently building out the community ${hub ? 'in <strong>' + hub + '</strong>' : 'in our core hubs'} to make sure that when we flip the switch, the connections are high-quality and actually relevant to your world.</p>
  <p style="font-size: 16px;">Whether you're here to:</p>
  <ul style="font-size: 16px; padding-left: 20px;">
    <li style="margin-bottom: 8px;"><strong>Network</strong> with other pros who know their way around a Gantry.</li>
    <li style="margin-bottom: 8px;"><strong>Make friends</strong> who won't ask why you're sleeping at 2 PM on a Tuesday.</li>
    <li style="margin-bottom: 8px;"><strong>Find a date</strong> who actually speaks our language.</li>
  </ul>
  <p style="font-size: 16px;">I'll reach out the second we're ready for our stealth launch. In the meantime, I'm curious—<strong>what's the one thing you wish other social apps understood about being in imaging?</strong></p>
  <p style="font-size: 16px;">Just hit reply and let me know. I read every single one.</p>
  <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;">
  <p style="font-size: 14px; color: #666666;">Cheers,<br>
    <strong style="color: #1a1a1a;">Moe @ RadMatch</strong><br>
    <a href="https://radmatch.app" style="color: #FF7F50; text-decoration: none;">radmatch.app</a>
  </p>
</div>
        `,
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), { status: 200, headers })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers })
  }
})
