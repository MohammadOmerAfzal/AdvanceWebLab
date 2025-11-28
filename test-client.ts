// test-client.ts
import { PrismaClient } from '@prisma/client'

console.log('Testing Prisma Client directly...')

const prisma = new PrismaClient()

async function test() {
  try {
    const products = await prisma.product.findMany()
    console.log('✅ Prisma Client works! Found products:', products.length)
    console.log('Products:', products)
  } catch (error) {
    console.log('❌ Prisma Client error:', error instanceof Error ? error.message : String(error))
  } finally {
    await prisma.$disconnect()
  }
}

test()