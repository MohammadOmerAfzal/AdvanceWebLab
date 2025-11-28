// app/layout.tsx
import './globals.css'
import CartButton from'../components/CartIcon'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <a href="/" className="text-xl font-bold">
              My Store
            </a>
            <nav className="flex items-center space-x-4">
              <a href="/" className="text-gray-700 hover:text-black">Home</a>
              <a href="/products" className="text-gray-700 hover:text-black">Products</a>
              <CartButton />
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}