// app/cart/page.tsx
import React from 'react'
import { getCartContents } from '@/app/actions/cart'
import { removeFromCart } from '@/app/actions/cart'

// Updated interfaces for MongoDB structure
interface Product {
  id: string;
  name: string;
  priceCents: number;
  description?: string;
  image?: string;
}

interface CartItem {
  _id: string;  // MongoDB uses _id
  productId: string;
  qty: number;
  product?: Product; // Product might be populated
}

interface Cart {
  _id: string;
  sessionId: string;
  items: CartItem[];
  createdAt: string;
}

export default async function CartView() {
  const cart = await getCartContents() as Cart | null;
  
  if (!cart || !cart.items || cart.items.length === 0) {
    return <p>Your cart is empty</p>
  }

  // Calculate total - handle cases where product might not be populated
  const total: number = cart.items.reduce((s: number, it: CartItem) => {
    if (it.product && it.product.priceCents) {
      return s + it.qty * it.product.priceCents;
    }
    return s;
  }, 0);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <ul className="space-y-3">
        {cart.items.map((it: CartItem) => (
          <li key={it._id} className="border p-3 rounded flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{it.product?.name || 'Product'}</h3>
              <p className="text-gray-600">
                {it.qty} × ${it.product ? (it.product.priceCents / 100).toFixed(2) : '0.00'} 
                = ${it.product ? ((it.product.priceCents * it.qty) / 100).toFixed(2) : '0.00'}
              </p>
            </div>
            
            <form
              action={async (formData: FormData) => {
                await removeFromCart(formData);
              }}
            >
              <input name="cartItemId" type="hidden" value={it._id} />
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