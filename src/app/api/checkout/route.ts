import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Supabase client (no necesita la service role aquí)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, eventId, eventTitle } = body

    if (!name || !email || !eventId || !eventTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 🧠 Buscar precio del evento en Supabase
    const { data: event, error } = await supabase
      .from('events')
      .select('price')
      .eq('id', eventId)
      .single()

    if (error || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Crear sesión en Stripe con precio dinámico
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: eventTitle },
            unit_amount: event.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        name,
        email,
        eventId,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/events`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('❌ Checkout error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
