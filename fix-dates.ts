// // fix-dates.ts
// import { prisma } from './lib/mongodb'

// async function fixDates() {
//   try {
//     console.log('Fixing date formats in MongoDB...')
    
//     // Update all products to fix the createdAt field
//     const result = await prisma.$runCommandRaw({
//       update: 'products',
//       updates: [
//         {
//           q: {}, // Match all documents
//           u: {
//             $set: {
//               createdAt: { $date: new Date().toISOString() }
//             }
//           },
//           multi: true
//         }
//       ]
//     })
    
//     console.log('Fixed dates for documents:', result.nModified)
    
//   } catch (error) {
//     console.error('Error fixing dates:', error)
//   } finally {
//     await prisma.$disconnect()
//   }
// }

// fixDates()