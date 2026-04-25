# 🎮 Gaming Marketplace

A full-stack gaming marketplace application where users can browse, search, and purchase in-game currency and cosmetics from popular games like Valorant, CS:GO, and Dota 2.

## 🌟 Features

### For Customers
- ✅ Browse games and products
- ✅ Search and filter by game/category
- ✅ View product details with ratings and reviews
- ✅ Shopping cart management
- ✅ Checkout and order placement
- ✅ User authentication (login/signup)
- ✅ View order history

### For Admins
- ✅ Add new games
- ✅ Manage products (coming soon)
- ✅ View sales and orders (coming soon)
- ✅ User management (coming soon)

## 🏗 Tech Stack

### Backend
- **Spring Boot 4.0.6** - Java web framework
- **PostgreSQL 15** - Relational database
- **JWT** - Authentication & authorization
- **BCrypt** - Password hashing
- **Maven** - Build management
- **Lombok** - Code generation

### Frontend
- **React 19** - UI library
- **TypeScript 6** - Type safety
- **Vite 8** - Build tool
- **React Router 7** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Tailwind CSS 4** - Styling
- **React Query** - Data fetching (optional)

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📁 Project Structure

```
fullstack-marketplace-app/
├── backend/
│   └── pp-marketplace/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/com/example/pp_marketplace/
│       │   │   │   ├── entity/          # JPA models
│       │   │   │   ├── repository/      # Data access layer
│       │   │   │   ├── service/         # Business logic
│       │   │   │   ├── controller/      # REST endpoints
│       │   │   │   └── dto/             # Data transfer objects
│       │   │   └── resources/
│       │   │       ├── schema.sql       # Database initialization
│       │   │       └── application.properties
│       │   └── test/
│       ├── pom.xml                      # Maven dependencies
│       └── Dockerfile (TODO)
│
├── frontend/
│   └── pp-marketplace-fe/
│       ├── src/
│       │   ├── pages/                   # React pages
│       │   ├── components/              # Reusable components
│       │   ├── services/                # API client
│       │   ├── store/                   # Zustand state stores
│       │   ├── types/                   # TypeScript interfaces
│       │   ├── hooks/                   # Custom React hooks
│       │   ├── utils/                   # Utility functions
│       │   ├── App.tsx                  # Main app with routes
│       │   ├── main.tsx                 # Entry point
│       │   └── index.css                # Global styles
│       ├── package.json
│       ├── tailwind.config.js
│       ├── vite.config.ts
│       ├── tsconfig.json
│       └── Dockerfile (TODO)
│
├── docker-compose.yml                   # Database service
├── SETUP_GUIDE.md                       # Detailed setup instructions
├── quickstart.sh                        # Quick start script
└── README.md                            # This file
```

## 🚀 Quick Start

### Option 1: Automatic (Recommended)
```bash
chmod +x quickstart.sh
./quickstart.sh
```

### Option 2: Manual Setup

#### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 15+ (or Docker)
- Maven 3.8+

#### Step 1: Start Database
```bash
docker-compose up -d
```

#### Step 2: Initialize Database Schema
```bash
psql -U postgres -d mydb -f backend/pp-marketplace/src/main/resources/schema.sql
```

#### Step 3: Start Backend
```bash
cd backend/pp-marketplace
mvn clean install
mvn spring-boot:run
```
Backend runs on `http://localhost:8080`

#### Step 4: Start Frontend
In a new terminal:
```bash
cd frontend/pp-marketplace-fe
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

## 📊 Database Schema

### Entity Relationship
```
User (1) ----< (M) Order ----< (M) OrderItem ----< (1) Product
                                                        ↑
                                                        ├─ (M) Review ← (1) User
                                                        └─ (M) CartItem ← (1) User
                                                        
Game (1) ----< (M) SubCategory ----< (M) Product
```

### Tables
1. **users** - Customer & admin accounts
2. **games** - Game titles (Valorant, CS:GO, Dota 2)
3. **sub_categories** - Game subcategories (VP, Skins, Cosmetics)
4. **products** - Individual items for sale
5. **orders** - Customer orders
6. **order_items** - Line items in orders
7. **reviews** - Product reviews & ratings
8. **cart_items** - Shopping cart items

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/login               - Customer/Admin login
POST   /api/auth/signup              - Customer registration
POST   /api/auth/admin/register      - Admin registration
```

### Products
```
GET    /api/products                 - Get all products
GET    /api/products/{id}            - Get product by ID
GET    /api/products/game/{gameId}   - Get products by game
GET    /api/products/search?term=... - Search products
```

### Games
```
GET    /api/games                    - Get all games
GET    /api/games/{id}               - Get game by ID
POST   /api/games                    - Create game (Admin)
PUT    /api/games/{id}               - Update game (Admin)
DELETE /api/games/{id}               - Delete game (Admin)
```

### Orders
```
POST   /api/orders                   - Create order
GET    /api/orders/{id}              - Get order details
GET    /api/orders/user/{userId}     - Get user's orders
```

### Cart
```
GET    /api/cart/{userId}            - Get cart items
POST   /api/cart                     - Add item to cart
PUT    /api/cart/{cartItemId}        - Update item quantity
DELETE /api/cart/{cartItemId}        - Remove item from cart
```

### Reviews
```
GET    /api/reviews/product/{id}     - Get product reviews
POST   /api/reviews                  - Add review
DELETE /api/reviews/{id}             - Delete review
```

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for complete API documentation.

## 🎨 UI Theme

Dark gaming theme with high contrast colors:
- **Primary Purple**: `#aa3bff` - Accent elements
- **Cyan**: `#00d4ff` - Highlights & hover effects
- **Gaming Pink**: `#ff006e` - Alerts & notifications
- **Gaming Orange**: `#ff9500` - Prices & CTA buttons
- **Dark Background**: `#0a0e27` - Main background
- **Dark Surface**: `#1a1f3a` - Cards & containers

## 🔐 Authentication

- JWT-based authentication
- BCrypt password hashing
- Token stored in localStorage
- Auto-login on page refresh
- Protected admin routes

**Default Admin Credentials** (after schema initialization):
- Email: `admin@marketplace.com`
- Password: See BCrypt hash in schema.sql

## 🧪 Testing

### Test Backend
```bash
# Get all games
curl http://localhost:8080/api/games

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@marketplace.com","password":"admin123"}'

# Search products
curl "http://localhost:8080/api/products/search?term=Valorant"
```

### Test Frontend
Open browser to `http://localhost:5173` and:
1. Browse home page with games and products
2. Click on a product to view details
3. Add item to cart
4. Go to cart and checkout
5. Login/signup
6. Admin dashboard (if logged in as admin)

## 📝 Sample Data

The database comes pre-loaded with:

### Games
- Valorant
- CS:GO
- Dota 2

### Products
- Valorant Points (1000, 2100, 5000 VP)
- CS:GO Skins (Dragon Lore, Howl)
- Knives (Karambit, M9 Bayonet)
- Dota 2 Cosmetics & Battle Pass

### Users
- Admin: `admin@marketplace.com`
- Customers: `customer1@example.com`, `customer2@example.com`

## 🔄 Build & Deploy

### Build Backend JAR
```bash
cd backend/pp-marketplace
mvn clean package
java -jar target/pp-marketplace-0.0.1-SNAPSHOT.jar
```

### Build Frontend
```bash
cd frontend/pp-marketplace-fe
npm run build
# Output in dist/
```

### Docker Deployment
```bash
# Build images
docker-compose build

# Run containers
docker-compose up
```

## 📋 Checklist for Production

- [ ] Change JWT secret in `application.properties`
- [ ] Use strong admin password
- [ ] Set up HTTPS/SSL
- [ ] Configure CORS for production domain
- [ ] Set up proper logging
- [ ] Configure email notifications
- [ ] Set up payment gateway (Stripe/PayPal)
- [ ] Add rate limiting
- [ ] Set up database backups
- [ ] Configure CDN for static assets
- [ ] Add monitoring & alerting
- [ ] Set up error tracking (Sentry)

## 🚧 Future Enhancements

- [ ] Product management UI (add, edit, delete)
- [ ] User profiles with order history
- [ ] Payment integration (Stripe, PayPal)
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] Wishlist feature
- [ ] Product recommendations
- [ ] Admin analytics dashboard
- [ ] Seller system (multi-vendor)
- [ ] Mobile app (React Native)
- [ ] Real-time chat support
- [ ] Inventory management system

## 🐛 Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `docker-compose ps`
- Check port 8080 is available: `lsof -i :8080`
- Check database credentials in `application.properties`

### Frontend can't connect to API
- Ensure backend is running on port 8080
- Check browser console for CORS errors
- Verify proxy in `vite.config.ts`

### Database connection failed
- Check PostgreSQL is running: `docker-compose logs postgres`
- Re-initialize schema: `psql -U postgres -d mydb -f schema.sql`
- Check password is correct

---

**Built with ❤️ for gamers by developers**

🎮 Happy gaming! 🎮
