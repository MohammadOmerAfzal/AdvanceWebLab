// lib/mongodb.ts
import { MongoClient } from 'mongodb'

// CORRECTED connection string - remove angle brackets and add database name
const uri = process.env.DATABASE_URL || 'mongodb+srv://momarafzal12_db_user:Minion%24123@cluster0.xsi0bhz.mongodb.net/mynextapp?retryWrites=true&w=majority'

const options = {
  // Add connection options for better reliability
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so the connection is preserved across module reloads
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise