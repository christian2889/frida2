'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Event {
  id: string
  title: string
  date: string
  price: number
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: true })

      if (error) {
        console.error('Error fetching events:', error)
      } else {
        setEvents(data)
      }
    }

    fetchEvents()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
      <ul className="space-y-4">
        {events.map((event) => (
          <li key={event.id} className="bg-white/10 p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <p>Price: ${(event.price / 100).toFixed(2)}</p>
            <Link href={`/checkout?eventId=${event.id}&title=${encodeURIComponent(event.title)}`}>
              <button className="mt-2 px-4 py-2 bg-white text-black rounded hover:bg-gray-300">
                Reserve Now
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
