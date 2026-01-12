# HerdShare Website Integration Guide

**Complete guide to connect your main website to the order tracking system**

---

## 🚀 QUICK START (Launch-Ready)

Since you're launching RIGHT NOW, here's what you need to do:

### 1. Deploy the Cloudflare Worker (5 minutes)

```bash
cd herdshare-spreadsheet-integration
npm install
npx wrangler deploy
```

Copy your worker URL: `https://herdshare-integration.YOUR-SUBDOMAIN.workers.dev`

### 2. Add to Main Website (10 minutes)

**Step A: Add Stripe.js to your `<head>`:**
```html
<script src="https://js.stripe.com/v3/"></script>
```

**Step B: Add Integration Script Before `</body>`:**
```html
<script src="website-integration.js"></script>
```

**Step C: Update Configuration in `website-integration.js`:**
```javascript
const STRIPE_PUBLIC_KEY = 'pk_live_YOUR_KEY'; // From Stripe Dashboard
const WORKER_URL = 'https://herdshare-integration.YOUR-SUBDOMAIN.workers.dev';
```

**Step D: Add Order Form**
Copy the entire contents of `order-form-component.html` into your main website where you want the order form to appear.

**Step E: Add Success/Cancel Pages**
- Upload `order-success.html` to `/order-success` on your website
- Upload `order-cancelled.html` to `/order-cancelled` on your website

### 3. Configure Stripe Webhook (3 minutes)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Endpoint URL: `https://herdshare-integration.YOUR-SUBDOMAIN.workers.dev/stripe-webhook`
4. Select event: `checkout.session.completed`
5. Copy webhook secret to Cloudflare Worker environment variables

---

## 🔄 HOW IT WORKS (Complete Flow)

### Step-by-Step Order Flow:

```
1. Customer fills out order form on herdshare.com
   ↓
2. JavaScript calls /create-checkout on Cloudflare Worker
   ↓
3. Worker creates Stripe checkout session with order metadata
   ↓
4. Customer redirected to Stripe Checkout (secure payment page)
   ↓
5. Customer enters card info and pays
   ↓
6. Stripe processes payment
   ↓
7. Stripe sends webhook to Worker: "checkout.session.completed"
   ↓
8. Worker validates webhook signature (security)
   ↓
9. Worker extracts order data from webhook
   ↓
10. Worker calculates financials (COGS, margins, fees, profit)
   ↓
11. Worker writes to Google Sheets (ORDERS + ACCOUNTING)
   ↓
12. Order appears in Admin Dashboard instantly
   ↓
13. Customer redirected to /order-success page
   ↓
14. Customer receives email confirmation from Stripe
   ↓
15. Team sees order in dashboard and begins fulfillment
```

---

## 📋 COMPLETE INTEGRATION STEPS

### Part 1: Cloudflare Worker Setup

**1. Set Environment Variables**

In Cloudflare Dashboard → Workers → Your Worker → Settings → Variables:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL = your-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY = -----BEGIN PRIVATE KEY-----...-----END PRIVATE KEY-----
SPREADSHEET_ID = your-spreadsheet-id
STRIPE_SECRET_KEY = sk_live_... (or sk_test_... for testing)
STRIPE_WEBHOOK_SECRET = whsec_... (get this AFTER creating webhook)
```

**2. Deploy Worker**

```bash
cd herdshare-spreadsheet-integration
npm install
npx wrangler login
npx wrangler deploy
```

Copy the deployed URL - you'll need it!

### Part 2: Main Website Integration

**1. Add Files to Your Website**

Your website structure should include:
```
/
├── index.html (your main page with order form)
├── order-success.html (new)
├── order-cancelled.html (new)
└── js/
    └── website-integration.js (new)
```

**2. Update Your Main Page HTML**

Add to `<head>`:
```html
<!-- Stripe.js -->
<script src="https://js.stripe.com/v3/"></script>
```

Add before `</body>`:
```html
<!-- HerdShare Order Integration -->
<script src="js/website-integration.js"></script>
```

**3. Add Order Form**

Copy everything from `order-form-component.html` and paste it into your main page where you want the order form.

**4. Update Configuration**

Edit `website-integration.js` line 7-8:
```javascript
const STRIPE_PUBLIC_KEY = 'pk_live_YOUR_ACTUAL_KEY';
const WORKER_URL = 'https://herdshare-integration.YOUR-SUBDOMAIN.workers.dev';
```

### Part 3: Stripe Configuration

**1. Get Your Stripe Keys**

- Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- Copy **Publishable key** (starts with `pk_`) → use in website-integration.js
- Copy **Secret key** (starts with `sk_`) → use in Cloudflare Worker env vars

**2. Create Webhook**

- Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
- Click "Add endpoint"
- Endpoint URL: `https://herdshare-integration.YOUR-SUBDOMAIN.workers.dev/stripe-webhook`
- Description: "HerdShare order processing"
- Events to send: Select **`checkout.session.completed`**
- Click "Add endpoint"
- Copy the **Signing secret** (starts with `whsec_`)
- Add to Cloudflare Worker env vars as `STRIPE_WEBHOOK_SECRET`

### Part 4: Google Sheets Setup

**Follow DEPLOYMENT-GUIDE.md Section "PART 1: Google Sheets Setup"**

Summary:
1. Create Google Sheet with ORDERS and ACCOUNTING sheets
2. Create service account in Google Cloud
3. Share sheet with service account email
4. Run `npm run init-spreadsheet` to set up headers

### Part 5: Admin Dashboard Deployment

**Upload to Cloudflare Pages:**

```bash
# In Cloudflare Dashboard:
# Workers & Pages → Create application → Upload assets

# Upload these files:
- admin-login.html
- admin-orders.html
- admin-accounting.html
- admin-style.css
```

**Update API URLs in admin files:**

Edit `admin-orders.html` and `admin-accounting.html` line 67:
```javascript
const API_URL = 'https://herdshare-integration.YOUR-SUBDOMAIN.workers.dev';
```

**Change default passwords** in `admin-login.html` line 51-55.

---

## 🧪 TESTING BEFORE LAUNCH

### Test Mode Setup (Use Stripe Test Keys)

1. Use test keys in all configs:
   - `pk_test_...` in website-integration.js
   - `sk_test_...` in Worker env vars

2. Use [Stripe test cards](https://stripe.com/docs/testing):
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Any future expiry date, any CVC

### Test Checklist

- [ ] Order form loads correctly
- [ ] Product selection works
- [ ] Form validation works
- [ ] Clicking "Proceed to Checkout" redirects to Stripe
- [ ] Test payment succeeds
- [ ] Redirects to order-success page
- [ ] Order appears in Google Sheets (ORDERS)
- [ ] Order appears in Google Sheets (ACCOUNTING)
- [ ] Order appears in Admin Dashboard
- [ ] Financials calculated correctly
- [ ] Test payment decline shows error
- [ ] Clicking "Cancel" redirects to order-cancelled page

---

## 🎯 PRODUCTION LAUNCH

### Pre-Launch Checklist

- [ ] All environment variables set in Worker
- [ ] Worker deployed successfully
- [ ] Website integration files uploaded
- [ ] Stripe **LIVE** keys configured (pk_live_, sk_live_)
- [ ] Webhook pointing to production worker URL
- [ ] Google Sheets initialized and shared
- [ ] Admin dashboard deployed
- [ ] Admin passwords changed from defaults
- [ ] Test order completed successfully
- [ ] Order appears in sheets and dashboard
- [ ] Success/cancel pages work
- [ ] Mobile responsive testing done

### Go Live!

1. Switch to Stripe **LIVE** mode:
   - Update `STRIPE_PUBLIC_KEY` to `pk_live_...`
   - Update `STRIPE_SECRET_KEY` to `sk_live_...`
   - Update webhook to use live mode endpoint

2. Deploy updated config

3. Test with real card (small amount)

4. Monitor first orders closely

---

## 📊 WHAT GETS TRACKED

### ORDERS Sheet (23 columns)

Every order captures:
- Order ID (auto-generated: HS-2026-001)
- Stripe Payment ID
- Timestamp
- Status (Pending → Processing → Shipped → Completed)
- Buyer information (name, email, phone, address)
- Product details (type, weight, price)
- Delivery window
- Rancher assignment
- Processing facility
- Tracking number
- Notes
- Financial data (price, costs, margins)

### ACCOUNTING Sheet (17 columns)

Every order tracks:
- Revenue
- Rancher cost
- Processing cost
- Shipping cost
- Total COGS
- Gross margin & %
- Stripe fee
- Net profit & %
- Rancher payment status
- Monthly aggregation

---

## 💰 AUTOMATIC CALCULATIONS

The system calculates automatically:

### Whole Cow ($4,750)
- Rancher: $2,800
- Processing: $500
- Shipping: $200
- **COGS: $3,500**
- **Gross Margin: $1,250 (26.3%)**
- Stripe Fee: $137.50
- **Net Profit: $1,112.50 (23.4%)**

### Half Cow ($2,370)
- Rancher: $1,400
- Processing: $300
- Shipping: $150
- **COGS: $1,850**
- **Gross Margin: $520 (21.9%)**
- Stripe Fee: $68.73
- **Net Profit: $451.27 (19.0%)**

### Quarter Cow ($1,180)
- Rancher: $700
- Processing: $200
- Shipping: $100
- **COGS: $1,000**
- **Gross Margin: $180 (15.3%)**
- Stripe Fee: $34.22
- **Net Profit: $145.78 (12.4%)**

---

## 🔐 SECURITY

### What's Protected:

✅ Webhook signature validation (prevents fake orders)
✅ Environment variables encrypted in Cloudflare
✅ Service account has minimal permissions (sheets only)
✅ Admin dashboard password-protected
✅ HTTPS enforced on all endpoints
✅ CORS configured correctly
✅ No API keys in frontend code
✅ Stripe handles all payment data (PCI compliant)

### What to Monitor:

- Cloudflare Worker logs for errors
- Stripe webhook event logs
- Google Sheets for unexpected writes
- Admin dashboard login attempts

---

## 🆘 TROUBLESHOOTING

### Orders Not Appearing in Sheets

**Check:**
1. Cloudflare Worker logs - any errors?
2. Stripe webhook logs - is webhook being received?
3. Environment variables - all set correctly?
4. Service account - has Editor access to sheet?
5. Google Sheets API - enabled in Google Cloud?

### Checkout Not Working

**Check:**
1. Browser console - any JavaScript errors?
2. STRIPE_PUBLIC_KEY correct in website-integration.js?
3. WORKER_URL correct in website-integration.js?
4. Stripe.js script loaded before website-integration.js?
5. Form ID is "herdshare-order-form"?

### Webhook Failing

**Check:**
1. Webhook URL exactly matches worker URL + /stripe-webhook
2. Webhook secret (whsec_...) matches env variable
3. Event `checkout.session.completed` is selected
4. Webhook is in same mode (test/live) as keys

### Dashboard Not Loading

**Check:**
1. API_URL in dashboard HTML files correct?
2. Worker deployed and accessible?
3. CORS headers configured in worker?
4. Browser console for errors?

---

## 📞 SUPPORT CONTACTS

**Stripe Support:** https://support.stripe.com
**Cloudflare Docs:** https://developers.cloudflare.com/workers/
**Google Sheets API:** https://developers.google.com/sheets

---

## 🎉 YOU'RE READY TO LAUNCH!

Your complete order processing system is ready:

✅ **Customer Experience:** Beautiful order form → Secure Stripe checkout → Confirmation
✅ **Operations:** Real-time Google Sheets tracking → Admin dashboard → Status updates
✅ **Accounting:** Automatic calculations → Revenue tracking → Financial reports
✅ **Team Collaboration:** Shared Google Sheets → Role-based dashboard access

**All systems go. Let's sell some American beef! 🐄🇺🇸**
