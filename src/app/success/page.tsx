'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAddress } from '@thirdweb-dev/react'


interface ConfirmData {
  name: string
  email: string
  eventTitle: string
}

export default function SuccessPage() {
  const address = useAddress()
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')

  const [info, setInfo] = useState<ConfirmData | null>(null)
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (!sessionId) return

    const confirm = async () => {
      const res = await fetch(`/api/confirm?session_id=${sessionId}`)
      if (res.ok) {
        const data = await res.json()
        setInfo(data)

        // ✅ Enviar email de confirmación con Resend
        await fetch('/api/send-confirmation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            eventTitle: data.eventTitle,
          }),
        })
        if (address) {
  await fetch('/api/mint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address,
      eventTitle: data.eventTitle,
    }),
  })
}

        setStatus('success')
      } else {
        setStatus('error')
      }
    }

    confirm()
  }, [sessionId])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Processing your reservation...</p>
      </div>
    )
  }

  if (status === 'error' || !info) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>❌ There was an error confirming your payment.</p>
        <button onClick={() => router.push('/events')} className="ml-4 underline">
          Back to events
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-4">🎉 Reservation Confirmed!</h1>
      <p className="mb-2">Thank you, {info.name}.</p>
      <p className="mb-2">
        Your reservation for <strong>{info.eventTitle}</strong> is confirmed.
      </p>
      <p className="mb-6">A confirmation email was sent to {info.email}.</p>
      <button
        onClick={() => router.push('/my-reservations')}
        className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
      >
        View My Reservations
      </button>
    </div>
  )
}
