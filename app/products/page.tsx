// app/products/page.tsx
import React from 'react'
import clientPromise from '../../lib/mongodb'
import { addToCart } from '../../app/actions/cart'

// Define Product type since we're not using Prisma anymore
interface Product {
  _id: string
  name: string
  description?: string
  priceCents: number
  image?: string
  createdAt: Date
}

async function getProducts(): Promise<Product[]> {
  try {
    const client = await clientPromise
    const db = client.db()
    const products = await db.collection('products').find({}).toArray()
    
    // Convert MongoDB documents to Product objects
    return products.map(product => ({
      _id: product._id.toString(),
      name: product.name,
      description: product.description,
      priceCents: product.priceCents,
      image: product.image,
      createdAt: product.createdAt
    }))
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Our Products</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: Product) => (
          <div key={product._id} className="border rounded-lg p-4 shadow-sm">
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
                <input type="hidden" name="productId" value={product._id} />
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

      {products.length === 0 && (
        <p className="text-center text-gray-500">No products found.</p>
      )}
    </div>
  )
}