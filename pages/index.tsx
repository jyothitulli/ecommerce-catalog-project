// pages/index.tsx
import { GetServerSideProps } from 'next'
import { prisma } from '../lib/prisma'
import { Prisma } from '@prisma/client'
import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
}

interface HomeProps {
  products: Product[]
  totalProducts: number
  currentPage: number
  totalPages: number
  searchQuery: string
}

export default function Home({ 
  products, 
  totalProducts, 
  currentPage, 
  totalPages,
  searchQuery 
}: HomeProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [search, setSearch] = useState(searchQuery || '')
  const [addingToCart, setAddingToCart] = useState<string | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push({
      pathname: '/',
      query: { ...router.query, q: search, page: 1 }
    })
  }

  const handleAddToCart = async (productId: string) => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setAddingToCart(productId)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 })
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
      setAddingToCart(null)
    }
  }

  return (
    <>
      <Head>
        <title>E-Commerce Catalog</title>
        <meta name="description" content="Browse our products" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Section */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                data-testid="search-input"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
              />
              <button
                type="submit"
                data-testid="search-button"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Search
              </button>
            </form>
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    data-testid={`product-card-${product.id}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <Link href={`/products/${product.id}`}>
                      <div className="cursor-pointer">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h2 className="text-lg font-semibold text-gray-800 mb-2">
                            {product.name}
                          </h2>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {product.description}
                          </p>
                          <p className="text-xl font-bold text-blue-600">
                            ${product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </Link>
                    <div className="px-4 pb-4">
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        disabled={addingToCart === product.id}
                        data-testid={`add-to-cart-button-${product.id}`}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        {addingToCart === product.id ? 'Adding...' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  <button
                    onClick={() => router.push(`/?page=${currentPage - 1}${searchQuery ? `&q=${searchQuery}` : ''}`)}
                    disabled={currentPage === 1}
                    data-testid="pagination-prev"
                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => router.push(`/?page=${currentPage + 1}${searchQuery ? `&q=${searchQuery}` : ''}`)}
                    disabled={currentPage === totalPages}
                    data-testid="pagination-next"
                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { q = '', page = '1' } = context.query
  const currentPage = parseInt(page as string, 10) || 1
  const productsPerPage = 8
  const searchQuery = q as string

  // Build where clause for search with proper Prisma types
  let where: Prisma.ProductWhereInput = {}
  
  if (searchQuery) {
    where = {
      OR: [
        {
          name: {
            contains: searchQuery,
            mode: 'insensitive' as Prisma.QueryMode
          }
        },
        {
          description: {
            contains: searchQuery,
            mode: 'insensitive' as Prisma.QueryMode
          }
        }
      ]
    }
  }

  // Get total count for pagination
  const totalProducts = await prisma.product.count({ where })

  // Get products for current page
  const products = await prisma.product.findMany({
    where,
    skip: (currentPage - 1) * productsPerPage,
    take: productsPerPage,
    orderBy: { createdAt: 'desc' }
  })

  const totalPages = Math.ceil(totalProducts / productsPerPage)

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      totalProducts,
      currentPage,
      totalPages,
      searchQuery
    }
  }
}