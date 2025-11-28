// app/actions/cart.ts
'use server'

import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'
import clientPromise from '../../lib/mongodb'
import { ObjectId } from 'mongodb' // ← Add this import

const CART_COOKIE = 'shop_session'

async function ensureSession() {
  const c = await cookies()
  let session = c.get(CART_COOKIE)?.value

  if (!session) {
    session = randomUUID()
    c.set({
      name: CART_COOKIE,
      value: session,
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    })
  }

  return session
}

export async function addToCart(formData: FormData) {
  try {
    const productId = formData.get('productId') as string
    const session = await ensureSession()
    const client = await clientPromise
    const db = client.db()

    // Convert productId string to ObjectId
    const productObjectId = new ObjectId(productId)

    // Find or create cart
    let cart = await db.collection('carts').findOne({ sessionId: session })

    if (!cart) {
      const result = await db.collection('carts').insertOne({
        sessionId: session,
        items: [],
        createdAt: new Date()
      })
      cart = { _id: result.insertedId, sessionId: session, items: [] }
    }

    // Check if product exists (using ObjectId)
    const product = await db.collection('products').findOne({ 
      _id: productObjectId 
    })

    if (!product) {
      return { success: false, error: 'Product not found' }
    }

    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex((item: any) => 
      item.productId === productId // Keep as string for comparison
    )

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].qty += 1
      await db.collection('carts').updateOne(
        { _id: cart._id },
        { $set: { items: cart.items } }
      )
    } else {
      // Add new item (store productId as string)
      await db.collection('carts').updateOne(
        { _id: cart._id },
        { 
          $push: { 
            items: {
              productId: productId, // Store as string
              qty: 1,
              addedAt: new Date()
            }
          }
        }
      )
    }

    return { success: true }
  } catch (error) {
    console.error('Add to cart error:', error)
    return { success: false, error: 'Failed to add to cart' }
  }
}

export async function removeFromCart(formData: FormData) {
  try {
    const productId = formData.get('productId') as string
    const session = await ensureSession()
    const client = await clientPromise
    const db = client.db()

    await db.collection('carts').updateOne(
      { sessionId: session },
      { 
        $pull: { 
          items: { productId: productId }
        }
      }
    )

    return { success: true }
  } catch (error) {
    console.error('Remove from cart error:', error)
    return { success: false, error: 'Failed to remove from cart' }
  }
}

export async function getCartContents() {
  try {
    const c = await cookies()
    const session = c.get(CART_COOKIE)?.value

    if (!session) return null

    const client = await clientPromise
    const db = client.db()

    const cart = await db.collection('carts').findOne({ sessionId: session })

    if (!cart || !cart.items || cart.items.length === 0) return null

    // Convert string productIds to ObjectIds for query
    const productObjectIds = cart.items.map((item: any) => new ObjectId(item.productId))

    // Get product details for items in cart
    const products = await db.collection('products').find({
      _id: { $in: productObjectIds } // Use ObjectIds here
    }).toArray()

    // Create a map for easy lookup
    const productsMap = new Map()
    products.forEach(product => {
      productsMap.set(product._id.toString(), product)
    })

    // Combine cart items with product data
    const itemsWithProducts = cart.items.map((item: any) => ({
      ...item,
      product: productsMap.get(item.productId) // Lookup by string ID
    })).filter((item: any) => item.product) // Only include items with valid products

    return {
      ...cart,
      items: itemsWithProducts
    }
  } catch (error) {
    console.error('Get cart error:', error)
    return null
  }
}