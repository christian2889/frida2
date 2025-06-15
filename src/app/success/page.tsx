'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface EventInfo {
  title: string
  date: string
}

interface CustomerInfo {
  name: string
  email: string
}

export default function SuccessPage() {
  const searchParams = useSearchParams()

  const [sessionId, setSessionId] = useState<string | null>(null)
  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null)
  const [customer, setCustomer] = useState<CustomerInfo | null>(null)
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const fetchConfirmation = async () => {
      const id = searchParams.get('session_id')
      setSessionId(id)

      if (!id) return

      try {
        const res = await fetch(`/api/confirm?session_id=${id}`)
        const data = await res.json()

        if (data?.event && data?.customer) {
          setEventInfo(data.event)
          setCustomer(data.customer)
          setStatus('success')
        } else {
          setStatus('error')
        }
      } catch (error) {
        console.error('❌ Error fetching confirmation:', error)
        setStatus('error')
      }
    }

    fetchConfirmation()
  }, [searchParams]) // ✅ Dependency list correcta

  if (status === 'loading') return <p className="text-white p-6">Loading confirmation...</p>
  if (status === 'error') return <p className="text-red-500 p-6">Something went wrong.</p>

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-4">🎉 Reservation Confirmed!</h1>
      <p className="mb-2">Thank you, {customer?.name}.</p>
      <p className="mb-2">
        You’re confirmed for <strong>{eventInfo?.title}</strong> on{' '}
        <strong>{eventInfo?.date}</strong>.
      </p>
      <p className="text-green-400">A confirmation email has been sent to {customer?.email}.</p>
    </div>
  )
}
