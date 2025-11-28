// app/api/cart-count/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import clientPromise from '../../../lib/mongodb'

export async function GET() {
  try {
    const c = await cookies()
    const session = c.get('shop_session')?.value

    if (!session) {
      return NextResponse.json({ count: 0 })
    }

    const client = await clientPromise
    const db = client.db()

    const cart = await db.collection('carts').findOne({ sessionId: session })

    if (!cart || !cart.items) {
      return NextResponse.json({ count: 0 })
    }

    const totalItems = cart.items.reduce((total: number, item: any) => {
      return total + (item.qty || 0)
    }, 0)

    return NextResponse.json({ count: totalItems })
  } catch (error) {
    console.error('Cart count API error:', error)
    return NextResponse.json({ count: 0 })
  }
}