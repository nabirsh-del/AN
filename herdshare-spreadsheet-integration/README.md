# HerdShare Spreadsheet Integration

**Complete order tracking and accounting system for HerdShare operations.**

## 🚀 Quick Links

- **[Quick Start Guide](./QUICK-START.md)** - 30-minute setup overview
- **[Deployment Guide](./DEPLOYMENT-GUIDE.md)** - Detailed step-by-step instructions
- **[Spreadsheet Schema](./spreadsheet-schema.md)** - Data structure reference

## Overview

This system automatically writes paid orders from Stripe to Google Sheets and provides a web-based admin dashboard for operations and accounting.

### What It Does

✅ **Captures orders** from Stripe checkout with full details
✅ **Writes to Google Sheets** for easy access and collaboration
✅ **Provides admin dashboard** with login and role-based access
✅ **Tracks operations** - order status, fulfillment, rancher assignment
✅ **Manages accounting** - revenue, costs, margins, profits
✅ **Calculates automatically** - COGS, margins, Stripe fees, net profit

### Architecture

```
Customer → Stripe Checkout → Webhook → Cloudflare Worker → Google Sheets
                                ↓
                        Admin Dashboard (Web UI)
```

## System Components

### 1. Google Sheets (Data Storage)

**ORDERS Sheet** - Operations tracking
- 23 columns for complete order management
- Status workflow (Pending → Processing → Shipped → Completed)
- Rancher assignment and fulfillment scheduling

**ACCOUNTING Sheet** - Financial tracking
- 17 columns for revenue and cost management
- Automatic margin calculations
- Product breakdown and monthly trends

### 2. Cloudflare Worker (Backend API)

**Backend Logic** (`worker.js`)
- Receives Stripe webhooks
- Validates webhook signatures
- Calculates order financials
- Writes to Google Sheets via API
- Provides REST API for admin dashboard

**API Endpoints:**
- `POST /stripe-webhook` - Stripe webhook handler
- `GET /api/orders` - Fetch all orders
- `GET /api/accounting` - Fetch accounting data
- `POST /api/orders/update` - Update order status

### 3. Admin Dashboard (Web Interface)

**Three-page admin portal:**
- **Login** (`admin-login.html`) - Password-protected access with roles
- **Orders** (`admin-orders.html`) - Live order tracking and management
- **Accounting** (`admin-accounting.html`) - Financial reporting and analytics

**Features:**
- Role-based access (admin, rancher, finance)
- Real-time data from Google Sheets
- Order filtering and search
- Status updates
- CSV export
- Financial summaries and charts

## Quick Setup

**Prerequisites:** Google account, Cloudflare account, Stripe account

1. **Google Sheets** - Create spreadsheet and service account (10 min)
2. **Initialize** - Run `npm run init-spreadsheet` to set up headers (2 min)
3. **Deploy Worker** - Deploy to Cloudflare Workers (5 min)
4. **Configure Stripe** - Add webhook endpoint (3 min)
5. **Deploy Dashboard** - Upload to Cloudflare Pages (5 min)
6. **Test** - Create test order and verify (5 min)

**Total setup time: ~30 minutes**

👉 **[Full deployment instructions](./DEPLOYMENT-GUIDE.md)**

## Key Features

### Order Management
- ✅ Automatic order capture from Stripe
- ✅ Complete buyer information
- ✅ Delivery address and scheduling
- ✅ Order status tracking
- ✅ Rancher assignment
- ✅ Processing facility coordination
- ✅ Shipping tracking

### Financial Tracking
- 💰 Revenue by product type
- 💰 Cost of Goods Sold (COGS)
- 💰 Gross margin calculations
- 💰 Stripe fee tracking
- 💰 Net profit analysis
- 💰 Monthly revenue trends
- 💰 Rancher payment tracking

### Admin Dashboard
- 🖥️ Password-protected access
- 🖥️ Role-based permissions
- 🖥️ Real-time order data
- 🖥️ Filtering and search
- 🖥️ Status updates
- 🖥️ Financial reports
- 🖥️ CSV export

## Pricing Structure

| Product | Weight | Price | COGS | Margin |
|---------|--------|-------|------|--------|
| Whole   | 475 lbs | $4,750 | $3,500 | $1,250 (26%) |
| Half    | 237 lbs | $2,370 | $1,850 | $520 (22%) |
| Quarter | 118 lbs | $1,180 | $1,000 | $180 (15%) |

## Files Included

```
herdshare-spreadsheet-integration/
├── worker.js                    # Cloudflare Worker backend
├── admin-login.html             # Admin login page
├── admin-orders.html            # Orders dashboard
├── admin-accounting.html        # Accounting dashboard
├── admin-style.css              # Shared styling
├── package.json                 # Node dependencies
├── wrangler.toml               # Cloudflare config
├── initialize-spreadsheet.js    # Setup script
├── spreadsheet-schema.md        # Data structure
├── DEPLOYMENT-GUIDE.md          # Full setup guide
├── QUICK-START.md              # Quick reference
└── README.md                    # This file
```

## Security

✅ Webhook signature validation
✅ Environment variables encrypted
✅ Password-protected admin access
✅ Service account with limited permissions
✅ HTTPS enforced
✅ CORS headers configured

## Support

**For detailed setup:** See [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)
**For quick reference:** See [QUICK-START.md](./QUICK-START.md)
**For data structure:** See [spreadsheet-schema.md](./spreadsheet-schema.md)

**Troubleshooting:**
- Check Cloudflare Worker logs
- Verify Stripe webhook logs
- Confirm Google Sheets permissions
- Review environment variables

## Production Ready

This system is **production-ready for Phase 1** operations.

✅ Real-time order capture
✅ Automated accounting
✅ Team collaboration via Google Sheets
✅ Admin dashboard for management
✅ Financial reporting

## Next Steps

1. Complete deployment following [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)
2. Test with sample order
3. Train team on admin dashboard
4. Integrate with main HerdShare website
5. Go live and start accepting orders!

---

**Built for HerdShare** - American beef, direct from independent ranches.
