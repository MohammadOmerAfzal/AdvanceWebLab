// app/cart/page.tsx
import React from 'react'
import { getCartContents, removeFromCart } from '@/app/actions/cart'

export default async function CartView() {
  const cart = await getCartContents()
  
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <p>Your cart is empty</p>
      </div>
    )
  }

  const total = cart.items.reduce((sum: number, item: any) => {
    return sum + ((item.product?.priceCents || 0) * item.qty)
  }, 0)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <ul className="space-y-3">
        {cart.items.map((item: any) => (
          <li key={item.productId} className="border p-3 rounded flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{item.product?.name || 'Product'}</h3>
              <p className="text-gray-600">
                {item.qty} × ${((item.product?.priceCents || 0) / 100).toFixed(2)} 
                = ${(((item.product?.priceCents || 0) * item.qty) / 100).toFixed(2)}
              </p>
            </div>
            
            <form action={removeFromCart}>
              <input name="productId" type="hidden" value={item.productId} />
              <button 
                type="submit" 
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </form>
          </li>
        ))}
      </ul>
      
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <p className="text-xl font-bold">
          Total: ${(total / 100).toFixed(2)}
        </p>
      </div>
    </div>
  )
}