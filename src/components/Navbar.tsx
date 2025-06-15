'use client'

import Link from 'next/link'
import { ConnectWallet } from '@thirdweb-dev/react'

export default function Navbar() {
  return (
    <nav className="bg-black text-white p-4 flex justify-between">
      <Link href="/" className="font-bold text-xl">
        Frida2
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/events">Events</Link>
        <Link href="/my-reservations">My Reservations</Link>
        <ConnectWallet />
      </div>
    </nav>
  )
}
