'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Reservation {
  id: string
  name: string
  email: string
  event_id: string
  created_at: string
}

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchReservations = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        router.push('/login')
        return
      }

      setUserEmail(user.email!)

      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('email', user.email)

      if (error) {
        console.error('Error loading reservations:', error)
      } else {
        setReservations(data)
      }

      setLoading(false)
    }

    fetchReservations()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading your reservations...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">My Reservations</h1>
      {reservations.length === 0 ? (
        <p>No reservations found for {userEmail}.</p>
      ) : (
        <ul className="space-y-4">
          {reservations.map((res) => (
            <li key={res.id} className="bg-white/10 p-4 rounded">
              <p className="text-lg font-semibold">Event ID: {res.event_id}</p>
              <p>Reserved on: {new Date(res.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
