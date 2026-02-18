// components/Header.tsx
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              E-Commerce Catalog
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Only show cart link if user is authenticated */}
            {session && (
              <Link 
                href="/cart" 
                className="text-gray-600 hover:text-gray-900"
              >
                Cart
              </Link>
            )}
            
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Hi, {session.user?.name || 'User'}
                </span>
                <button
                  onClick={() => signOut()}
                  data-testid="signout-button"
                  className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                data-testid="signin-button"
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}