# Zenith - MSME Operations AI Dashboard

Decision-Centric AI system for MSME operations management. Autonomously track customer requests, inventory, and ongoing work with real-time visibility.

## 🚀 Features

### 📦 Inventory Management
- **Three-tier stock tracking**: Minimum stock, Current stock, and Critical (last-minute) threshold
- Visual stock level indicators with color-coded alerts
- Category-based filtering
- Expiry date tracking

### 🚨 Urgency Tracking
- Real-time alerts for low stock and critical levels
- Expiry date countdown with urgency levels
- Critical alert popup notifications
- Timeline view of approaching deadlines

### 🎯 Priority Management
- Order priority levels: URGENT, HIGH, MEDIUM, LOW
- Deadline tracking with overdue indicators
- Visual priority queue
- Order status management (Pending, In Progress, Completed, Cancelled)

### ⚡ Additional Features
- Modern, premium dark theme UI
- Glassmorphism effects and smooth animations
- Real-time data updates
- Mock data fallback for development
- Responsive design for all devices
- Clerk authentication integration

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Authentication**: Clerk
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Modern CSS with custom design system
- **API Client**: Axios

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Clerk account (for authentication)

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/zenith_db?schema=public"

# Backend API (if separate)
VITE_API_BASE_URL=http://localhost:4000/api
```

### 3. Database Setup

Initialize Prisma and create the database schema:

```bash
# Generate Prisma Client
npx prisma generate

# Create database migration
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view/edit data
npx prisma studio
```

### 4. Clerk Setup

1. Go to [clerk.com](https://clerk.com) and create a new application
2. Copy your publishable key to `.env` as `VITE_CLERK_PUBLISHABLE_KEY`
3. Configure sign-in options in the Clerk dashboard

### 5. Run Development Server

```bash
npm run dev
```

The application will open at `http://localhost:3000`

## 📂 Project Structure

```
zenith-hackron/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx      # Main dashboard
│   │   ├── InventoryPanel.jsx # Inventory management
│   │   ├── UrgencyPanel.jsx   # Urgency & alerts
│   │   ├── PriorityPanel.jsx  # Order priorities
│   │   └── StockInputForm.jsx # Add stock form
│   ├── services/
│   │   └── api.js             # API service layer
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # Entry point
│   └── index.css              # Design system
├── .env                       # Environment variables
├── package.json
└── vite.config.js
```

## 🎨 Design System

The application uses a comprehensive design system with:

- **Color Palette**: Premium dark theme with vibrant accents
- **Typography**: Inter font family
- **Components**: Glassmorphism cards, badges, buttons, forms
- **Animations**: Smooth transitions, hover effects, loading states
- **Responsive**: Mobile-first approach

## 🔌 API Integration

The app is designed to work with a backend API. Update `VITE_API_BASE_URL` in `.env` to point to your backend.

### Expected API Endpoints:

- `GET /api/stock-items` - List all stock items
- `POST /api/stock-items` - Create new stock item
- `GET /api/orders` - List all orders
- `GET /api/alerts` - List all alerts
- `PUT /api/stock-items/:id` - Update stock item
- `PATCH /api/orders/:id/status` - Update order status

### Mock Data

If the API is unavailable, the dashboard automatically falls back to mock data for development and demonstration purposes.

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Deploy to Vercel/Netlify

1. Connect your repository
2. Set environment variables in the platform
3. Deploy!

## 🎯 Usage for Hackathon

This project demonstrates:

1. **AI-Driven Decision Making**: Automatic urgency calculation based on stock levels and expiry dates
2. **Autonomous Operation Tracking**: Real-time monitoring of inventory, orders, and tasks
3. **Intelligent Alerting**: Context-aware notifications for critical situations
4. **Priority-Based Workflow**: Smart order prioritization and deadline management

## 📝 Database Models

### StockItem
- Tracks inventory with minimum, current, and critical thresholds
- Expiry date for perishable items
- Category and unit management

### Order
- Customer order management
- Priority levels (URGENT, HIGH, MEDIUM, LOW)
- Status tracking and deadline monitoring
- Links to stock items via OrderItem

### UrgencyAlert
- System-generated alerts for various conditions
- Severity levels: CRITICAL, HIGH, MEDIUM, LOW
- Alert types: LOW_STOCK, EXPIRY_SOON, CRITICAL_STOCK, DEADLINE_APPROACHING

### Task
- Task assignment and tracking
- Status management
- Due date monitoring
- Optional link to orders

## 🤝 Contributing

This is a hackathon project. Feel free to fork and modify!

## 📄 License

MIT

## 🙏 Acknowledgments

Built for the MSME Operations AI Hackathon to demonstrate decision-centric AI for operational excellence.
