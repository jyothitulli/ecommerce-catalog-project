// pages/cart.tsx
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    imageUrl: string
  }
}

interface Cart {
  id: string
  items: CartItem[]
}

export default function CartPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchCart()
    }
  }, [session])

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        setCart(data)
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setUpdating(productId)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: newQuantity })
      })

      if (response.ok) {
        const updatedCart = await response.json()
        setCart(updatedCart)
      }
    } catch (error) {
      console.error('Failed to update cart:', error)
    } finally {
      setUpdating(null)
    }
  }

  const removeItem = async (productId: string) => {
    setUpdating(productId)
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })

      if (response.ok) {
        const updatedCart = await response.json()
        setCart(updatedCart)
      }
    } catch (error) {
      console.error('Failed to remove item:', error)
    } finally {
      setUpdating(null)
    }
  }

  const calculateTotal = () => {
    if (!cart) return 0
    return cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Your Cart - E-Commerce Catalog</title>
      </Head>

      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

          {!cart || cart.items.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    data-testid={`cart-item-${item.product.id}`}
                    className="bg-white rounded-lg shadow p-4 flex items-center space-x-4"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                    
                    <div className="flex-1">
                      <Link href={`/products/${item.product.id}`}>
                        <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
                      
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <label htmlFor={`quantity-${item.product.id}`} className="sr-only">
                            Quantity
                          </label>
                          <input
                            id={`quantity-${item.product.id}`}
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                            disabled={updating === item.product.id}
                            data-testid={`quantity-input-${item.product.id}`}
                            className="w-16 px-2 py-1 border border-gray-300 rounded-md text-black bg-white"
                          />
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.product.id)}
                          disabled={updating === item.product.id}
                          data-testid={`remove-item-button-${item.product.id}`}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900 font-semibold">
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900 font-semibold">Free</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span 
                          data-testid="cart-total"
                          className="text-lg font-bold text-blue-600"
                        >
                          ${calculateTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Checkout
                  </button>
                  
                  <div className="mt-4 text-center">
                    <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}