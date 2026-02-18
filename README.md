E-Commerce Product Catalog
A modern, full-stack e-commerce catalog built with Next.js, featuring server-side rendering, user authentication, and a fully functional shopping cart.

✨ Features
Server-Side Rendering (SSR) - Dynamic product pages with fresh data on every request

🔐 Authentication - Email/password login + OAuth (GitHub/Google) using NextAuth.js

🛒 Shopping Cart - Add/remove items, update quantities, protected routes

🔍 Search & Pagination - Server-side search with pagination

📱 Responsive Design - Mobile-friendly UI with Tailwind CSS

🗄️ PostgreSQL Database - Using Prisma ORM

🧪 Test Ready - All UI elements have data-testid attributes for testing

🚀 Live Demo
After running locally:

Homepage: http://localhost:3000

Sign In: http://localhost:3000/auth/signin

Cart: http://localhost:3000/cart (protected)

📋 Prerequisites
Node.js 18+ (v20 recommended)

PostgreSQL 15+

npm or yarn

(Optional) GitHub/Google OAuth credentials

🛠️ Installation
1. Clone & Install
bash
# Clone the repository
git clone <your-repo-url>
cd my-ecommerce-app

# Install dependencies
npm install
2. Environment Setup
Create a .env file in the root directory:

env
# Database
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/ecommerce"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-this"

# OAuth Providers (optional)
GITHUB_ID=""
GITHUB_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
Generate a secure NEXTAUTH_SECRET:

bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
3. Database Setup
bash
# Create the database
psql -U postgres -c "CREATE DATABASE ecommerce;"

# Push the schema
npx prisma db push

# Seed the database with sample products and test user
npm run db:seed

# (Optional) Open Prisma Studio to view data
npx prisma studio
4. Run the Development Server
bash
npm run dev
Visit http://localhost:3000 🎉

🧪 Test Credentials
text
Email: test.user@example.com
Password: password123
📁 Project Structure
text
my-ecommerce-app/
├── components/          # React components
│   └── Header.tsx      # Navigation header with auth
├── lib/
│   └── prisma.ts       # Prisma client singleton
├── pages/
│   ├── api/            # API routes
│   │   ├── auth/       # NextAuth.js configuration
│   │   └── cart/       # Cart API endpoints
│   ├── auth/
│   │   └── signin.tsx  # Custom sign-in page
│   ├── products/
│   │   └── [id].tsx    # Product detail page (SSR)
│   ├── _app.tsx        # App wrapper with SessionProvider
│   ├── cart.tsx        # Shopping cart page
│   └── index.tsx       # Homepage with product listing (SSR)
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── seed.js         # Database seeding script
├── public/             # Static assets
├── styles/
│   └── globals.css     # Global styles
├── types/
│   └── next-auth.d.ts  # TypeScript types for NextAuth
├── .env                # Environment variables
├── .env.example        # Example environment variables
├── next.config.js      # Next.js configuration
├── package.json        # Dependencies and scripts
├── postcss.config.js   # PostCSS configuration
├── proxy.ts            # Route protection middleware
├── submission.json     # Test user credentials
├── tailwind.config.js  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
🔌 API Routes
Endpoint	Method	Description	Auth Required
/api/cart	GET	Get user's cart	✅
/api/cart	POST	Add item to cart	✅
/api/cart	DELETE	Remove item from cart	✅
/api/auth/session	GET	Get current session	❌
/api/auth/providers	GET	List auth providers	❌
🧪 Testing with data-testid
All interactive elements have data-testid attributes for E2E testing:

Homepage:

search-input - Search field

search-button - Search button

product-card-{id} - Product container

add-to-cart-button-{id} - Add to cart button

pagination-next / pagination-prev - Pagination buttons

Product Detail:

product-name - Product name

product-price - Product price

product-description - Product description

add-to-cart-button - Add to cart button

Cart:

cart-item-{id} - Cart item container

quantity-input-{id} - Quantity input

remove-item-button-{id} - Remove button

cart-total - Total price

Auth:

signin-button - Sign in button

signout-button - Sign out button

🚢 Docker (Optional)
If you prefer Docker:

bash
# Build and start containers
docker-compose up --build

# Stop containers
docker-compose down
The app will be available at http://localhost:3000

📝 Available Scripts
bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
🔒 Environment Variables
Variable	Description	Required
DATABASE_URL	PostgreSQL connection string	✅
NEXTAUTH_URL	Your app URL (http://localhost:3000)	✅
NEXTAUTH_SECRET	Secret for JWT encryption	✅
GITHUB_ID	GitHub OAuth Client ID	❌
GITHUB_SECRET	GitHub OAuth Client Secret	❌
GOOGLE_CLIENT_ID	Google OAuth Client ID	❌
GOOGLE_CLIENT_SECRET	Google OAuth Client Secret	❌
🧪 Quick Test Flow
Start the server: npm run dev

Open http://localhost:3000

Click "Sign In" and use test credentials

Browse products and add to cart

View cart at http://localhost:3000/cart

Update quantities or remove items

Sign out and try accessing cart (redirects to login)

🎯 Key Features Implemented
✅ Server-side rendering with getServerSideProps

✅ Dynamic product pages with 404 handling

✅ Search functionality (filter by name/description)

✅ Pagination (8 products per page)

✅ User authentication (credentials + OAuth)

✅ Protected API routes

✅ Shopping cart with quantity management

✅ Route protection with middleware/proxy

✅ Database integration with Prisma

✅ Responsive design with Tailwind CSS

✅ All required data-testid attributes

🐛 Troubleshooting
Port 3000 already in use?

bash
# Find and kill the process
netstat -ano | findstr :3000
taskkill /PID <PID> /F
Database connection error?

Verify PostgreSQL is running

Check credentials in .env

Run npx prisma db push to sync schema

Can't sign in?

Run npm run db:seed to recreate test user

Check submission.json matches seeded user# New Feature
