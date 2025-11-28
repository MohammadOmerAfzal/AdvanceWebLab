// scripts/seed.ts
import clientPromise from '../lib/mongodb'

async function seed() {
  try {
    const client = await clientPromise
    const db = client.db()

    // Clear existing products
    await db.collection('products').deleteMany({})

    // Insert new products
    const products = [
      { 
        name: 'Red Sneakers', 
        description: 'Comfortable running shoes', 
        priceCents: 7999, 
        image: '/images/sneakers.jpg',
        createdAt: new Date()
      },
      { 
        name: 'Blue Jeans', 
        description: 'Slim fit denim', 
        priceCents: 4999, 
        image: '/images/jeans.jpg',
        createdAt: new Date()
      },
      { 
        name: 'Green Hoodie', 
        description: 'Cozy hoodie', 
        priceCents: 5999, 
        image: '/images/hoodie.jpg',
        createdAt: new Date()
      }
    ]

    const result = await db.collection('products').insertMany(products)
    console.log('Seed finished. Inserted:', result.insertedCount, 'products')
    
  } catch (error) {
    console.error('Seed error:', error)
  }
}

seed()