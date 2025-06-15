'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [price, setPrice] = useState(0)
  const [published, setPublished] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data, error } = await supabase.from('events').insert([
      {
        title,
        date,
        price,
        published,
      },
    ])

    if (error) {
      console.error('Insert error:', error)
      setMessage('❌ Error creating event')
    } else {
      console.log('Insert success:', data) // ✅ Usar `data` aquí
      setMessage('✅ Event created')
      setTitle('')
      setDate('')
      setPrice(0)
      setPublished(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Admin: Create Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Event Title"
          className="w-full p-2 rounded bg-white/10"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="date"
          className="w-full p-2 rounded bg-white/10"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price in cents (e.g. 2000 = $20)"
          className="w-full p-2 rounded bg-white/10"
          value={price}
          onChange={(e) => setPrice(parseInt(e.target.value))}
          required
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Published
        </label>
        <button
          type="submit"
          className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
        >
          Create Event
        </button>
        {message && <p className="text-green-400">{message}</p>}
      </form>
    </div>
  )
}
