import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// ✅ Usa la versión compatible y evita errores de tipo
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil' as const,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, eventId, eventTitle } = body

    if (!name || !email || !eventId || !eventTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: eventTitle,
            },
            unit_amount: 2000, // 💰 Puedes personalizar esto si tienes precio dinámico
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/events`,
      metadata: {
        eventId,
        name,
        email,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe Checkout error:', err)
    return NextResponse.json({ error: 'Stripe Checkout failed' }, { status: 500 })
  }
}
