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
    const { email } = await req.json()

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Moe @ RadMatch <contact@radmatch.app>',
        to: email,
        subject: "Welcome to the break room. ☢️ (RadMatch)",
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
            <p>Hey there,</p>
            <p>Thanks so much for joining the RadMatch waitlist!</p>
            <p>I’m Moe. I started building RadMatch because, let's be honest—the imaging world is a small circle, but it can feel pretty lonely when you’re the only one on call or staring at a monitor all night.</p>
            <p>We’re building this as a <strong>community first</strong>. A place where we actually understand each other's schedules, jokes, and daily grinds. Whether you're looking to:</p>
            <ul>
              <li><strong>Network</strong> with other pros who know their way around a Gantry.</li>
              <li><strong>Make friends</strong> who won't ask you why you're sleeping at 2 PM on a Tuesday.</li>
              <li><strong>Find a date</strong> who actually speaks our language.</li>
              <li><strong>Check the Radfeed</strong> to see what's happening in the field.</li>
            </ul>
            <p>We’re rolling this out in our <strong>Columbus</strong> and <strong>Detroit</strong> hubs first to make sure the connections are real and the community stays high-quality.</p>
            <p>I'll reach out the second we're ready for our stealth launch. In the meantime, I'm curious—what's the one thing you wish other social apps understood about being in imaging?</p>
            <p>Just hit reply and let me know. Happy to have you here!</p>
            <p>Cheers,<br><strong>Moe @ RadMatch</strong></p>
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