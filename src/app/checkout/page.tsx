'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const eventId = searchParams.get('eventId') || ''
  const title = searchParams.get('title') || ''

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ name, email, eventId, eventTitle: title }),
    })

    const data = await res.json()

    if (data.url) {
      window.location.href = data.url
    } else {
      alert('❌ Error creating checkout session')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Reserve: {title}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-2 rounded bg-white/10"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full p-2 rounded bg-white/10"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 w-full"
          disabled={loading}
        >
          {loading ? 'Redirecting to Stripe...' : 'Continue to Payment'}
        </button>
      </form>
    </div>
  )
}
