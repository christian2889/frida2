import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil' as const,

})

// Supabase - usando la *service-role key* para poder insertar
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // ⬅️ añade esta variable en .env.local
)

export async function GET(req: NextRequest) {
  try {
    const session_id = req.nextUrl.searchParams.get('session_id')
    if (!session_id) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
    }

    // 1️⃣ Recupera la sesión de Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    // 2️⃣ Extrae metadata
    const { name, email, eventId } = session.metadata as {
      name: string
      email: string
      eventId: string
    }

    // 3️⃣ Inserta la reserva (si no existe ya)
    await supabase
      .from('reservations')
      .insert([{ name, email, event_id: eventId }])
      .eq('email', email) // evita duplicados sencillos

    return NextResponse.json({ name, email, eventTitle: session.line_items?.data[0].description })
  } catch (err) {
    console.error('Confirm error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
