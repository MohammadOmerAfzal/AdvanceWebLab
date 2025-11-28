// components/CartIcon.tsx
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function CartIcon() {
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    // Fetch cart count on component mount
    const fetchCartCount = async () => {
      try {
        const response = await fetch('/api/cart-count')
        const data = await response.json()
        setItemCount(data.count)
      } catch (error) {
        console.error('Error fetching cart count:', error)
      }
    }

    fetchCartCount()

    // Optional: Refresh count when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchCartCount()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <Link href="/cart" className="relative group">
      <div className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 transition-colors">
        <svg 
          className="w-6 h-6 text-gray-700" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" 
          />
        </svg>
        <span className="text-gray-700 font-medium">Cart</span>
        
        {/* Item count badge */}
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </div>
    </Link>
  )
}