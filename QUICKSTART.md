# 🚀 Quick Start Guide - Zenith Dashboard

## Step-by-Step Setup (5 minutes)

### 1️⃣ Get Clerk Keys

1. Visit [clerk.com](https://clerk.com) and sign up
2. Create a new application
3. Go to **API Keys** section
4. Copy the **Publishable Key**

### 2️⃣ Setup Environment

Create `.env` file in project root:

```bash
cp .env.example .env
```

Edit `.env` and add your Clerk key:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

> **Note**: For now, you can leave `DATABASE_URL` and `VITE_API_BASE_URL` as-is. The dashboard will use mock data!

### 3️⃣ Install & Run

```bash
# Install dependencies (already done!)
npm install

# Start the dev server
npm run dev
```

Visit **http://localhost:3000** 🎉

### 4️⃣ First Login

1. Click "Sign In" or go to `/sign-in`
2. Create a new account with Clerk
3. You'll be redirected to the dashboard!

---

## ✨ Demo Mode (No Backend Required!)

The dashboard automatically uses **mock data** if the backend API isn't available. This means you can:

- ✅ See the full dashboard with sample data
- ✅ Test all UI components
- ✅ Demo to judges/investors
- ✅ Develop without backend dependency

**Mock Data Includes:**
- 4 sample stock items (various categories)
- 3 sample orders (different priorities)
- 3 sample alerts (including critical ones)

---

## 🎯 What You'll See

### Dashboard Overview
- 📦 Total Items count
- ⚠️ Low Stock alerts
- 📋 Active Orders
- 🚨 Urgent Alerts

### Inventory Panel
- Steel Rods (LOW stock)
- Packaging Boxes (NORMAL)
- Adhesive Glue (CRITICAL)
- Paint - Blue (NORMAL)

### Urgency Panel
- Critical alert popup for Adhesive Glue
- Expiry countdown timers
- Alert severity badges

### Priority Panel
- URGENT: ABC Manufacturing (due tomorrow)
- HIGH: XYZ Enterprises (3 days)
- MEDIUM: Local Retailer (7 days)

---

## 🔧 Optional: Database Setup

If you want to connect a real database:

### PostgreSQL Setup

```bash
# Install PostgreSQL (if not installed)
# macOS
brew install postgresql@14
brew services start postgresql@14

# Create database
createdb zenith_db

# Update .env with your connection
DATABASE_URL="postgresql://username:password@localhost:5432/zenith_db?schema=public"
```

### Run Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view/edit data
npx prisma studio
```

---

## 🎨 Customization

### Change App Name

Edit [`index.html`](file:///Users/hartej/Hartej46/rabbit.com/Hackron/zenith-hackron/index.html):
```html
<title>Your App Name</title>
```

### Modify Colors

Edit [`src/index.css`](file:///Users/hartej/Hartej46/rabbit.com/Hackron/zenith-hackron/src/index.css):
```css
:root {
  --color-primary: #your-color;
  --color-secondary: #your-color;
}
```

### Update Mock Data

Edit [`src/components/Dashboard.jsx`](file:///Users/hartej/Hartej46/rabbit.com/Hackron/zenith-hackron/src/components/Dashboard.jsx) → `loadMockData()` function

---

## 📱 Testing Features

### Add New Stock Item
1. Click "**+ Add Stock**" button
2. Fill in the form
3. Watch real-time status indicator change
4. Submit to see it in inventory (if backend connected)

### Filter Inventory
- Use category dropdown to filter stock items

### Filter Orders
- Use priority and status dropdowns in Priority Panel

### View Urgency Alerts
- Check Urgency Panel for critical alerts
- See countdown timers for expiring items

---

## 🐛 Troubleshooting

### Port 3000 Already in Use?

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in vite.config.js
server: { port: 3001 }
```

### Clerk Authentication Issues?

- Check that `VITE_CLERK_PUBLISHABLE_KEY` is set in `.env`
- Ensure key starts with `pk_test_` or `pk_live_`
- Restart dev server after changing `.env`

### Dependencies Not Installing?

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 For Your Hackathon Demo

### Talking Points

1. **Three-Tier Inventory**
   - "We track stock at three levels: minimum, current, and critical threshold"
   - Show color-coded status indicators

2. **Intelligent Urgency**
   - "System automatically calculates urgency based on expiry dates"
   - Demo the countdown timers and popup alerts

3. **Smart Prioritization**
   - "Orders are automatically sorted by priority and deadline"
   - Show the visual priority stripes and badges

4. **Modern UX**
   - "Premium dark theme with glassmorphism effects"
   - Hover over cards to show animations

5. **Production-Ready**
   - "Built with industry-standard tools: React, Prisma, TypeScript-ready"
   - Show the clean code structure

### Demo Flow

1. Show dashboard overview with stats
2. Scroll to Inventory Panel → explain three-tier system
3. Show Urgency Panel → demo countdown and alerts
4. Show Priority Panel → explain auto-sorting
5. Click "Add Stock" → demo form validation
6. Show responsive design (resize browser)

---

## 📚 Additional Resources

- **Clerk Docs**: https://clerk.com/docs
- **Prisma Docs**: https://prisma.io/docs
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev

---

## 🤝 Need Help?

Check the comprehensive [`README.md`](file:///Users/hartej/Hartej46/rabbit.com/Hackron/zenith-hackron/README.md) for detailed documentation!

---

**Happy Hacking! You're ready to demo! 🚀**
