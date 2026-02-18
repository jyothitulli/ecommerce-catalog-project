// pages/api/cart/index.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'  // This should now work
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'

// Validation schema for adding to cart
const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().positive().default(1)
})

// Validation schema for removing from cart
const removeFromCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required")
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)

  // Check if user is authenticated
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const userId = session.user.id

  try {
    // GET /api/cart - Fetch cart contents
    if (req.method === 'GET') {
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      })

      if (!cart) {
        // Create cart if it doesn't exist
        const newCart = await prisma.cart.create({
          data: { userId },
          include: {
            items: {
              include: {
                product: true
              }
            }
          }
        })
        return res.status(200).json(newCart)
      }

      return res.status(200).json(cart)
    }

    // POST /api/cart - Add item to cart
    if (req.method === 'POST') {
      // Validate request body
      const validationResult = addToCartSchema.safeParse(req.body)
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: 'Invalid request body', 
          details: validationResult.error.errors 
        })
      }

      const { productId, quantity } = validationResult.data

      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id: productId }
      })

      if (!product) {
        return res.status(404).json({ error: 'Product not found' })
      }

      // Find or create user's cart
      let cart = await prisma.cart.findUnique({
        where: { userId }
      })

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId }
        })
      }

      // Check if item already in cart
      const existingItem = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId
          }
        }
      })

      if (existingItem) {
        // Update quantity
        await prisma.cartItem.update({
          where: {
            cartId_productId: {
              cartId: cart.id,
              productId
            }
          },
          data: {
            quantity: existingItem.quantity + quantity
          }
        })
      } else {
        // Create new cart item
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity
          }
        })
      }

      // Return updated cart
      const updatedCart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      })

      return res.status(200).json(updatedCart)
    }

    // DELETE /api/cart - Remove item from cart
    if (req.method === 'DELETE') {
      // Validate request body
      const validationResult = removeFromCartSchema.safeParse(req.body)
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: 'Invalid request body', 
          details: validationResult.error.errors 
        })
      }

      const { productId } = validationResult.data

      // Find user's cart
      const cart = await prisma.cart.findUnique({
        where: { userId }
      })

      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' })
      }

      // Remove item from cart
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          productId
        }
      })

      // Return updated cart
      const updatedCart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      })

      return res.status(200).json(updatedCart)
    }

    // Handle unsupported methods
    return res.status(405).json({ error: 'Method not allowed' })
    
  } catch (error) {
    console.error('Cart API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}