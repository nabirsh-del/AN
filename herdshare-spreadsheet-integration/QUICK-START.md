# HerdShare Spreadsheet Integration - Quick Start

**TL;DR:** Complete order tracking and accounting system that writes Stripe orders to Google Sheets and provides an admin dashboard.

## What This System Does

1. **Captures orders** from Stripe checkout
2. **Writes to Google Sheets** with full order details and financial data
3. **Provides admin dashboard** for viewing orders and accounting
4. **Tracks revenue** and calculates margins automatically
5. **Manages fulfillment** with status tracking and rancher assignment

## System Architecture

```
┌─────────────┐
│   Customer  │
│   Orders    │
└──────┬──────┘
       │
       ▼
┌─────────────┐        ┌──────────────────┐        ┌──────────────┐
│   Stripe    │───────▶│  Cloudflare      │───────▶│   Google     │
│  Checkout   │ webhook│   Worker         │  API   │   Sheets     │
└─────────────┘        └──────────────────┘        └──────────────┘
                               │                          ▲
                               │                          │
                               ▼                          │
                       ┌──────────────────┐              │
                       │  Admin Dashboard │──────────────┘
                       │  (Web Interface) │   reads data
                       └──────────────────┘
```

## Key Features

### 📦 Order Tracking (ORDERS Sheet)
- Real-time order capture from Stripe
- Full buyer information
- Delivery tracking
- Rancher assignment
- Status workflow (Pending → Processing → Shipped → Completed)
- Processing facility scheduling

### 💰 Accounting (ACCOUNTING Sheet)
- Automatic revenue calculation
- Cost of Goods Sold (COGS) tracking
- Gross margin and net profit
- Stripe fee calculation
- Product type breakdown
- Monthly revenue trends
- Rancher payment tracking

### 🖥️ Admin Dashboard
- **Login page** with role-based access (admin, rancher, finance)
- **Orders view:**
  - Live order table
  - Status filtering
  - Order detail modal
  - Status updates
  - Search functionality
- **Accounting view:**
  - Financial summary
  - Product breakdown
  - Monthly revenue chart
  - CSV export
  - Rancher payment tracking

## File Structure

```
herdshare-spreadsheet-integration/
├── worker.js                    # Cloudflare Worker (backend API)
├── admin-login.html             # Login page
├── admin-orders.html            # Orders dashboard
├── admin-accounting.html        # Accounting dashboard
├── admin-style.css              # Shared styles
├── package.json                 # Dependencies
├── wrangler.toml               # Cloudflare config
├── initialize-spreadsheet.js    # One-time setup script
├── spreadsheet-schema.md        # Spreadsheet structure
├── README.md                    # Overview
├── DEPLOYMENT-GUIDE.md          # Full setup instructions
└── QUICK-START.md              # This file
```

## Quick Setup (30 minutes)

1. **Google Sheets** (10 min)
   - Create spreadsheet
   - Create service account
   - Share sheet with service account

2. **Initialize Headers** (2 min)
   - Run `npm run init-spreadsheet`

3. **Deploy Worker** (5 min)
   - Set environment variables
   - Run `npm run deploy`

4. **Configure Stripe** (3 min)
   - Add webhook endpoint
   - Copy webhook secret

5. **Deploy Admin Dashboard** (5 min)
   - Upload to Cloudflare Pages
   - Update API_URL
   - Set passwords

6. **Test** (5 min)
   - Create test order
   - Check spreadsheet
   - Login to dashboard

📖 **Full instructions:** See [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)

## Data Flow Example

**When a customer orders a whole cow for $4,750:**

1. Stripe checkout completes
2. Webhook fires to Cloudflare Worker
3. Worker calculates:
   - Estimated weight: 475 lbs
   - Rancher cost: $2,800
   - Processing cost: $500
   - Shipping cost: $200
   - Total COGS: $3,500
   - Gross margin: $1,250 (26.3%)
   - Stripe fee: $137.50
   - Net profit: $1,112.50 (23.4%)

4. Worker writes to Google Sheets:
   - New row in ORDERS sheet
   - New row in ACCOUNTING sheet

5. Admin dashboard shows:
   - New order in Orders view
   - Updated revenue in Accounting view
   - Pending status for fulfillment

## User Roles

### Admin
- Full access to Orders and Accounting
- Can update order status
- Can assign ranchers
- Can export data

### Rancher (read-only)
- View assigned orders
- See delivery schedules
- Check processing dates

### Finance (accounting-only)
- View Accounting dashboard
- Export financial data
- Track rancher payments

## Default Passwords

⚠️ **CHANGE THESE IMMEDIATELY** in `admin-login.html`:

- **admin:** `herdshare2026`
- **rancher:** `ranch2026`
- **finance:** `finance2026`

## API Endpoints

The Cloudflare Worker provides:

- `POST /stripe-webhook` - Receives Stripe events
- `GET /api/orders` - Returns all orders
- `GET /api/accounting` - Returns accounting data
- `POST /api/orders/update` - Update order status
- `GET /health` - Health check

## Environment Variables Required

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...-----END PRIVATE KEY-----
SPREADSHEET_ID=your-spreadsheet-id
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SECRET_KEY=sk_...
```

## Product Pricing

| Product | Weight | Price | Rancher | Processing | Shipping | COGS | Margin |
|---------|--------|-------|---------|------------|----------|------|--------|
| Whole   | 475    | $4,750| $2,800  | $500       | $200     | $3,500 | $1,250 |
| Half    | 237    | $2,370| $1,400  | $300       | $150     | $1,850 | $520   |
| Quarter | 118    | $1,180| $700    | $200       | $100     | $1,000 | $180   |

## Status Workflow

```
Pending → Processing → Shipped → Completed
   ↓           ↓
Cancelled  Refunded
```

## Next Steps After Deployment

1. **Test with real order** - Place actual test order
2. **Train team** - Show ranchers/finance how to use dashboard
3. **Set up monitoring** - Check Cloudflare Worker logs
4. **Add to website** - Integrate Stripe checkout
5. **Go live** - Start accepting orders!

## Support & Troubleshooting

**Orders not appearing?**
- Check Stripe webhook logs
- Verify Cloudflare Worker logs
- Confirm environment variables

**Dashboard not loading?**
- Check browser console
- Verify API_URL is correct
- Confirm worker is deployed

**Permission denied?**
- Check service account has Editor access
- Verify Google Sheets API is enabled

## Production Readiness

✅ **Phase 1 Ready**
- Basic authentication
- Order tracking
- Accounting
- Manual fulfillment

🔄 **Future Enhancements**
- OAuth authentication
- Email notifications
- Automated rancher assignment
- Customer order portal
- Integration with processing facilities

---

**You're all set!** This system is ready for Phase 1 operations. Monitor closely and iterate based on real usage.

Questions? Check [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) for detailed setup instructions.
