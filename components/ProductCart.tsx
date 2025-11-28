'use client'

import React from 'react'
import { addToCart } from '@/app/actions/cart'

type Product = {
  id: number
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

      <form action={async (formData) => {
        await addToCart(formData.get('productId') as string);
      }}>
        <input type="hidden" name="productId" value={product.id} />
        <button type="submit">Add to cart</button>
      </form>
    </div>
  )
}
