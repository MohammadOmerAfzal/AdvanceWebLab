// app/actions/cart.ts
'use server'

import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

const CART_COOKIE = 'shop_session'

// ----------------------
// TYPES
// ----------------------
export interface CartItem {
  productId: string
  qty: number
  addedAt: Date
}

export interface Product {
  _id: ObjectId
  name: string
  priceCents: number
  description?: string
  image?: string
}

export interface Cart {
  _id: ObjectId
  sessionId: string
  items: CartItem[]
  createdAt: Date
}

// ----------------------
// SESSION CREATION
// ----------------------
async function ensureSession(): Promise<string> {
  const c = await cookies()
  let session = c.get(CART_COOKIE)?.value

  if (!session) {
    session = randomUUID()
    c.set({
      name: CART_COOKIE,
      value: session,
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })
  }

  return session
}

// ----------------------
// ADD TO CART
// ----------------------
export async function addToCart(formData: FormData): Promise<void> {
  const productId = formData.get('productId') as string
  if (!productId) return

  const session = await ensureSession()
  const client = await clientPromise
  const db = client.db()

  // Find or create cart
  let cart = await db.collection<Cart>('carts').findOne({ sessionId: session })

  if (!cart) {
    const insert = await db.collection<Cart>('carts').insertOne({
      _id: new ObjectId(),
      sessionId: session,
      items: [],
      createdAt: new Date(),
    })

    cart = { _id: insert.insertedId, sessionId: session, items: [], createdAt: new Date() }
  }

  const existingIndex = cart.items.findIndex(i => i.productId === productId)

  if (existingIndex >= 0) {
    // Increment quantity
    cart.items[existingIndex].qty += 1
    await db.collection('carts').updateOne(
      { _id: cart._id },
      { $set: { items: cart.items } }
    )
  } else {
    // Add new product
    await db.collection('carts').updateOne(
      { _id: cart._id },
      { 
        $push: { 
          items: { productId, qty: 1, addedAt: new Date() } 
        } 
      } as any // Type assertion for MongoDB operations
    )
  }
}

// ----------------------
// REMOVE FROM CART
// ----------------------
export async function removeFromCart(formData: FormData): Promise<void> {
  const productId = formData.get('productId') as string
  if (!productId) return

  const session = await ensureSession()
  const client = await clientPromise
  const db = client.db()

  await db.collection<Cart>('carts').updateOne(
    { sessionId: session },
    { $pull: { items: { productId: productId } } } as any // Type assertion for MongoDB operations
  )
}

// ----------------------
// GET CART CONTENTS
// ----------------------
export async function getCartContents() {
  const c = await cookies()
  const session = c.get(CART_COOKIE)?.value
  if (!session) return null

  const client = await clientPromise
  const db = client.db()

  const cart = await db.collection<Cart>('carts').findOne({ sessionId: session })
  if (!cart || cart.items.length === 0) return null

  const productIds = cart.items.map(i => new ObjectId(i.productId))
  const products = await db
    .collection<Product>('products')
    .find({ _id: { $in: productIds } })
    .toArray()

  const productsMap = new Map(products.map(p => [p._id.toString(), p]))

  const itemsWithProducts = cart.items
    .map(i => {
      const product = productsMap.get(i.productId)
      if (!product) return null
      return { ...i, product }
    })
    .filter(i => i !== null)

  return { ...cart, items: itemsWithProducts }
}