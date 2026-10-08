const TO = String(process.env.CONTACT_TO || 'dylan@premierikon.com').trim()

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export async function POST(request) {
  try {
    const body = await request.json()
    const firstName = String(body.firstName || '').trim()
    const lastName = String(body.lastName || '').trim()
    const email = String(body.email || '').trim().toLowerCase()
    const inquiry = String(body.inquiry || '').trim()

    if (!firstName || !lastName || !email.includes('@') || !inquiry) {
      return Response.json({ error: 'Please complete all fields.' }, { status: 400 })
    }

    const apiKey = String(process.env.RESEND_API_KEY || '').trim()
    if (!apiKey) {
      return Response.json({ error: 'Email is not configured yet.' }, { status: 500 })
    }

    const from = String(process.env.RESEND_FROM || 'PickMyWinner <info@gotbluff.com>').trim()
    const name = `${firstName} ${lastName}`
    const subject = `PickMyWinner inquiry from ${name}`
    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#10151c">
        <h2 style="margin:0 0 12px">New PickMyWinner inquiry</h2>
        <p style="margin:0 0 8px"><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p style="margin:0 0 8px"><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p style="margin:16px 0 8px"><strong>Inquiry</strong></p>
        <p style="margin:0;white-space:pre-wrap">${escapeHtml(inquiry)}</p>
      </div>
    `
    const text = [
      'New PickMyWinner inquiry',
      `Name: ${name}`,
      `Email: ${email}`,
      '',
      'Inquiry',
      inquiry,
    ].join('\n')

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [TO],
        reply_to: email,
        subject,
        html,
        text,
      }),
    })

    const payload = await response.json().catch(() => ({}))
    if (!response.ok) {
      const error = payload.error?.message || payload.message || 'The message could not be sent.'
      return Response.json({ error }, { status: 502 })
    }

    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'The message could not be sent.' }, { status: 500 })
  }
}
