// app/actions/cart-utils.ts
'use server'

import { cookies } from 'next/headers'
import clientPromise from '../../lib/mongodb'

export async function getCartItemsCount() {
  try {
    const c = await cookies()
    const session = c.get('shop_session')?.value

    if (!session) return 0

    const client = await clientPromise
    const db = client.db()

    const cart = await db.collection('carts').findOne({ sessionId: session })

    if (!cart || !cart.items) return 0

    // Calculate total items count (sum of all quantities)
    const totalItems = cart.items.reduce((total: number, item: any) => {
      return total + (item.qty || 0)
    }, 0)

    return totalItems
  } catch (error) {
    console.error('Get cart count error:', error)
    return 0
  }
}