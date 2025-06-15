import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, eventTitle } = body

  if (!name || !email || !eventTitle) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Frida2 <noreply@frida2.com>',
      to: email,
      subject: `🎉 Your reservation for ${eventTitle}`,
      html: `
        <h1>Reservation Confirmed</h1>
        <p>Hi ${name},</p>
        <p>Your spot for <strong>${eventTitle}</strong> is confirmed!</p>
        <p>Thank you for reserving with Frida2.</p>
      `,
    })

    if (error) {
      console.error('Email error:', error) // ✅ usar error
      return NextResponse.json({ error: 'Email send failed' }, { status: 500 })
    }

    console.log('Email sent:', data) // ✅ usar data
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Server error:', err) // ✅ usar err
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
