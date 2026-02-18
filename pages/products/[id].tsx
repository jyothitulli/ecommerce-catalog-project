// pages/products/[id].tsx
import { GetServerSideProps } from 'next'
import { prisma } from '../../lib/prisma'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
}

interface ProductPageProps {
  product: Product | null
}

export default function ProductPage({ product }: ProductPageProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [addingToCart, setAddingToCart] = useState(false)

  if (!product) {
    return (
      <>
        <Head>
          <title>Product Not Found</title>
        </Head>
        <div className="min-h-screen bg-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Return to Home
            </Link>
          </div>
        </div>
      </>
    )
  }

  const handleAddToCart = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setAddingToCart(true)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 })
      })

      if (response.ok) {
        alert('Product added to cart!')
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to add to cart')
      }
    } catch (error) {
      alert('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  return (
    <>
      <Head>
        <title>{product.name} - E-Commerce Catalog</title>
        <meta name="description" content={product.description} />
      </Head>

      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              ← Back to Products
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0 md:w-1/2">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="p-8 md:w-1/2">
                <h1 
                  data-testid="product-name"
                  className="text-3xl font-bold text-gray-900 mb-4"
                >
                  {product.name}
                </h1>
                
                <p 
                  data-testid="product-price"
                  className="text-2xl font-bold text-blue-600 mb-4"
                >
                  ${product.price.toFixed(2)}
                </p>
                
                <p 
                  data-testid="product-description"
                  className="text-gray-600 mb-6"
                >
                  {product.description}
                </p>

                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  data-testid="add-to-cart-button"
                  className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string }

  try {
    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return {
        notFound: true
      }
    }

    return {
      props: {
        product: JSON.parse(JSON.stringify(product)) // Serialize dates
      }
    }
  } catch (error) {
    return {
      notFound: true
    }
  }
}