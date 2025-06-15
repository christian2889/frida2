'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/my-reservations`,
      },
    })

    if (error) {
      setMessage('❌ Error sending login link')
    } else {
      setMessage('✅ Check your email for the login link!')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4 w-full max-w-md">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 rounded bg-white/10"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 w-full"
        >
          Send Magic Link
        </button>
        {message && <p className="text-green-400">{message}</p>}
      </form>
    </div>
  )
}
