// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seeding...')

  // Create test user (for submission.json)
  const testUser = await prisma.user.upsert({
    where: { email: 'test.user@example.com' },
    update: {},
    create: {
      email: 'test.user@example.com',
      name: 'Test User',
      password: await bcrypt.hash('password123', 10),
    },
  })
  console.log('Created test user:', testUser.email)

  // Create cart for test user
  await prisma.cart.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
    },
  })

  // Sample products
  const products = [
    {
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation. Perfect for music lovers and professionals.',
      price: 99.99,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format',
    },
    {
      name: 'Smart Watch',
      description: 'Track your fitness, receive notifications, and more with this stylish smart watch.',
      price: 199.99,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format',
    },
    {
      name: 'Laptop Backpack',
      description: 'Durable and stylish backpack with padded laptop compartment. Perfect for work or travel.',
      price: 49.99,
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format',
    },
    {
      name: 'Mechanical Keyboard',
      description: 'RGB mechanical keyboard with blue switches. Great for gaming and typing.',
      price: 79.99,
      imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&auto=format',
    },
    {
      name: '4K Monitor',
      description: '27-inch 4K UHD monitor with HDR support. Perfect for creative work.',
      price: 299.99,
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format',
    },
    {
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse with long battery life.',
      price: 29.99,
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format',
    },
    {
      name: 'USB-C Hub',
      description: '7-in-1 USB-C hub with HDMI, USB ports, and card readers.',
      price: 39.99,
      imageUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500&auto=format',
    },
    {
      name: 'External SSD',
      description: '1TB portable SSD with fast transfer speeds.',
      price: 89.99,
      imageUrl: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=500&auto=format',
    },
    {
      name: 'Gaming Chair',
      description: 'Ergonomic gaming chair with lumbar support.',
      price: 199.99,
      imageUrl: 'https://images.unsplash.com/photo-1598558301610-31a12a4bc8ed?w=500&auto=format',
    },
    {
      name: 'Webcam',
      description: '1080p webcam with built-in microphone for video calls.',
      price: 59.99,
      imageUrl: 'https://images.unsplash.com/photo-1587826080692-f439cd0bd70c?w=500&auto=format',
    },
    {
      name: 'Microphone',
      description: 'USB condenser microphone for streaming and recording.',
      price: 69.99,
      imageUrl: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=500&auto=format',
    },
    {
      name: 'Desk Lamp',
      description: 'LED desk lamp with wireless charging pad.',
      price: 34.99,
      imageUrl: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=500&auto=format',
    },
  ]

  // Create products
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: '' }, // This will create new ones each time
      update: {},
      create: product,
    })
  }

  console.log(`Created ${products.length} products`)

  // Verify data
  const productCount = await prisma.product.count()
  const userCount = await prisma.user.count()
  
  console.log('Seeding completed successfully!')
  console.log(`Total products: ${productCount}`)
  console.log(`Total users: ${userCount}`)
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })