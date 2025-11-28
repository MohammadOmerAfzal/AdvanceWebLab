'use client'

import React from 'react'
import { addToCart } from '@/app/actions/cart'

type Product = {
  id: string // changed to string to match MongoDB ObjectId
  name: string
  description?: string
  priceCents: number
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>Price: ${(product.priceCents / 100).toFixed(2)}</p>

      {/* Pass FormData automatically via <form action={addToCart}> */}
      <form action={addToCart}>
        <input type="hidden" name="productId" value={product.id} />
        <button type="submit">Add to cart</button>
      </form>
    </div>
  )
}
