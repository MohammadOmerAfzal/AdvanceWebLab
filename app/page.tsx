// app/page.tsx
import React from 'react'
import clientPromise from '../lib/mongodb'
import { addToCart } from './actions/cart'

async function getProducts() {
  try {
    const client = await clientPromise
    const db = client.db()
    const products = await db.collection('products').find({}).toArray()
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function Home() {
  const products = await getProducts()

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to Our Store</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id.toString()} className="border rounded-lg p-4 shadow-sm">
            {product.image && (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            
            {product.description && (
              <p className="text-gray-600 mb-4">{product.description}</p>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">
                ${(product.priceCents / 100).toFixed(2)}
              </span>
              
              <form action={addToCart}>
                <input type="hidden" name="productId" value={product._id.toString()} />
                <button 
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add to Cart
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}