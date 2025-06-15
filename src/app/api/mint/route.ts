import { NextRequest, NextResponse } from 'next/server'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'

export async function POST(req: NextRequest) {
  try {
    const { address, eventTitle } = await req.json()

    if (!address || !eventTitle) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    const sdk = ThirdwebSDK.fromPrivateKey(
      process.env.THIRDWEB_PRIVATE_KEY!,
      'polygon'
    )

    const contract = await sdk.getContract(process.env.NEXT_PUBLIC_THIRDWEB_CONTRACT_ADDRESS!)

    const metadata = {
      name: `Frida2: ${eventTitle}`,
      description: `NFT ticket for ${eventTitle}`,
      image: 'https://yourdomain.com/ticket.png', // opcional
    }

    const tx = await contract.erc721.mintTo(address, metadata)

    return NextResponse.json({ success: true, tx })
  } catch (error) {
    console.error('Mint error:', error)
    return NextResponse.json({ error: 'Mint failed' }, { status: 500 })
  }
}
