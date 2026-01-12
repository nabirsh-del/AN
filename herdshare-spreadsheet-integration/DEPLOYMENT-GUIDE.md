# HerdShare Spreadsheet Integration - Deployment Guide

Complete step-by-step guide to deploy the order tracking and accounting system.

## Overview

This system connects:
- **Stripe** (payment processing) → **Cloudflare Worker** (backend) → **Google Sheets** (data storage) → **Admin Dashboard** (web interface)

## Prerequisites

- Google Account
- Cloudflare Account (free tier works)
- Stripe Account
- Node.js installed locally (for initial setup)

---

## PART 1: Google Sheets Setup

### Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click "Blank" to create new spreadsheet
3. Name it: **HerdShare Orders**
4. Create two sheets:
   - Rename "Sheet1" to **ORDERS**
   - Add new sheet named **ACCOUNTING**
5. Copy the **Spreadsheet ID** from URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```
   Save this ID - you'll need it later.

### Step 2: Create Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project:
   - Click project dropdown → "New Project"
   - Name: "HerdShare Integration"
   - Click "Create"

3. Enable Google Sheets API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

4. Create Service Account:
   - Go to "IAM & Admin" → "Service Accounts"
   - Click "Create Service Account"
   - Name: `herdshare-sheets`
   - Description: "HerdShare order tracking integration"
   - Click "Create and Continue"
   - Grant role: "Editor" (or just create without role)
   - Click "Done"

5. Create Service Account Key:
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON"
   - Click "Create" - a JSON file will download
   - **SAVE THIS FILE SECURELY** - you'll need it next

6. Share Spreadsheet with Service Account:
   - Open the JSON key file
   - Copy the `client_email` value (looks like: `herdshare-sheets@project-name.iam.gserviceaccount.com`)
   - Go back to your Google Sheet
   - Click "Share" button
   - Paste the service account email
   - Give it "Editor" access
   - Click "Send"

---

## PART 2: Initialize Spreadsheet

### Step 3: Set Up Headers

1. Open terminal and navigate to the integration folder:
   ```bash
   cd herdshare-spreadsheet-integration
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set environment variables (from your JSON key file):
   ```bash
   export GOOGLE_SERVICE_ACCOUNT_EMAIL="herdshare-sheets@project-name.iam.gserviceaccount.com"
   export GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key-Here\n-----END PRIVATE KEY-----\n"
   export SPREADSHEET_ID="your-spreadsheet-id"
   ```

   **Windows users:**
   ```cmd
   set GOOGLE_SERVICE_ACCOUNT_EMAIL=herdshare-sheets@project-name.iam.gserviceaccount.com
   set GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYour-Key-Here\n-----END PRIVATE KEY-----\n
   set SPREADSHEET_ID=your-spreadsheet-id
   ```

4. Run initialization script:
   ```bash
   npm run init-spreadsheet
   ```

5. Verify in Google Sheets:
   - Check that ORDERS sheet has 23 column headers
   - Check that ACCOUNTING sheet has 17 column headers
   - Headers should be bold with green background

---

## PART 3: Deploy Cloudflare Worker

### Step 4: Set Up Cloudflare

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Log in or create account
3. Go to "Workers & Pages"
4. Click "Create Application" → "Create Worker"
5. Name it: `herdshare-integration`
6. Click "Deploy"

### Step 5: Configure Environment Variables

1. In Cloudflare Worker, go to "Settings" → "Variables"
2. Add the following environment variables:

   **From Google Service Account JSON:**
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: The `client_email` from JSON
   - `GOOGLE_PRIVATE_KEY`: The `private_key` from JSON (include BEGIN/END lines)
   - `SPREADSHEET_ID`: Your Google Sheets ID

   **From Stripe Dashboard:**
   - `STRIPE_SECRET_KEY`: Get from [Stripe Dashboard](https://dashboard.stripe.com/apikeys) → "Secret key"
   - `STRIPE_WEBHOOK_SECRET`: Will get this in next step

3. Click "Encrypt" for each variable
4. Click "Save"

### Step 6: Deploy Worker Code

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Update `wrangler.toml` with your account info if needed

4. Deploy:
   ```bash
   npm run deploy
   ```

5. Copy the worker URL (e.g., `https://herdshare-integration.your-subdomain.workers.dev`)

---

## PART 4: Configure Stripe Webhook

### Step 7: Create Stripe Webhook

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click "Developers" → "Webhooks"
3. Click "Add endpoint"
4. Endpoint URL: `https://herdshare-integration.your-subdomain.workers.dev/stripe-webhook`
5. Select events to listen to:
   - `checkout.session.completed`
6. Click "Add endpoint"
7. Copy the "Signing secret" (starts with `whsec_`)
8. Go back to Cloudflare Worker Settings → Variables
9. Add/update: `STRIPE_WEBHOOK_SECRET` = the signing secret
10. Save

---

## PART 5: Deploy Admin Dashboard

### Step 8: Host Admin Dashboard on Cloudflare Pages

1. Upload admin dashboard files to Cloudflare Pages:
   - `admin-login.html`
   - `admin-orders.html`
   - `admin-accounting.html`
   - `admin-style.css`

2. Update `API_URL` in both dashboard HTML files:
   ```javascript
   const API_URL = 'https://herdshare-integration.your-subdomain.workers.dev';
   ```

3. Deploy to Cloudflare Pages:
   - Go to Cloudflare Dashboard → "Workers & Pages" → "Pages"
   - Click "Create application" → "Upload assets"
   - Upload the 4 admin files
   - Set project name: `herdshare-admin`
   - Click "Deploy"

4. Your admin dashboard will be available at:
   ```
   https://herdshare-admin.pages.dev
   ```

### Step 9: Set Admin Passwords

1. Edit `admin-login.html` and change the passwords:
   ```javascript
   const ADMIN_CREDENTIALS = {
       'admin': 'YOUR_SECURE_PASSWORD_HERE',
       'rancher': 'YOUR_RANCHER_PASSWORD_HERE',
       'finance': 'YOUR_FINANCE_PASSWORD_HERE'
   };
   ```

2. Re-upload to Cloudflare Pages

**IMPORTANT:** For production, implement proper authentication (Auth0, Clerk, etc.). The current system is basic password protection suitable for Phase 1.

---

## PART 6: Test the System

### Step 10: Test Order Flow

1. Create a test Stripe checkout session with metadata:
   ```javascript
   {
     metadata: {
       buyerName: "Test Fraternity",
       organizationType: "Fraternity",
       deliveryAddress: "123 Test St, Austin TX 78705",
       productType: "Whole",
       deliveryWindow: "Feb 1-5, 2026",
       notes: "Test order"
     }
   }
   ```

2. Complete test payment

3. Check Google Sheet - new row should appear in both ORDERS and ACCOUNTING sheets

4. Check Admin Dashboard:
   - Go to `https://herdshare-admin.pages.dev`
   - Login with admin credentials
   - Verify order appears in Orders view
   - Check Accounting view for revenue data

### Step 11: Test Admin Features

1. **Orders Dashboard:**
   - View order details
   - Update order status
   - Filter by status/product
   - Search orders

2. **Accounting Dashboard:**
   - Verify revenue calculations
   - Check product breakdown
   - View monthly trends
   - Export CSV

---

## PART 7: Integrate with Main Website

### Step 12: Add Stripe Checkout to Website

In your main HerdShare website ordering page:

```javascript
// When user clicks "Order Now"
async function createCheckout(productType, buyerInfo) {
  const response = await fetch('YOUR_API_ENDPOINT/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productType: productType, // "Whole", "Half", or "Quarter"
      buyerName: buyerInfo.name,
      organizationType: buyerInfo.type,
      email: buyerInfo.email,
      phone: buyerInfo.phone,
      deliveryAddress: buyerInfo.address,
      deliveryWindow: buyerInfo.deliveryWindow,
      notes: buyerInfo.notes
    })
  });

  const { sessionId } = await response.json();

  // Redirect to Stripe Checkout
  const stripe = Stripe('YOUR_STRIPE_PUBLIC_KEY');
  await stripe.redirectToCheckout({ sessionId });
}
```

---

## Security Checklist

- [ ] Changed all default passwords in `admin-login.html`
- [ ] Service account JSON file stored securely (not in git)
- [ ] All environment variables encrypted in Cloudflare
- [ ] Webhook signature validation enabled
- [ ] Google Sheet shared only with service account (not public)
- [ ] HTTPS enforced on all endpoints
- [ ] Admin dashboard requires authentication

---

## Troubleshooting

### Orders Not Appearing in Spreadsheet

1. Check Stripe webhook logs - is webhook being called?
2. Check Cloudflare Worker logs - any errors?
3. Verify environment variables are set correctly
4. Confirm service account has Editor access to sheet

### Admin Dashboard Not Loading Data

1. Check browser console for errors
2. Verify `API_URL` points to correct worker URL
3. Check CORS headers in worker response
4. Confirm worker is deployed and accessible

### Google Sheets Permission Denied

1. Verify service account email is shared with Editor access
2. Check that Google Sheets API is enabled in Google Cloud Console
3. Verify private key is correctly formatted (includes BEGIN/END lines)

---

## Maintenance

### Weekly Tasks
- Review pending orders in admin dashboard
- Mark completed orders as "Completed"
- Export accounting data for records

### Monthly Tasks
- Export accounting CSV
- Reconcile with QuickBooks
- Review rancher payment status
- Archive completed orders older than 90 days

### As Needed
- Update order statuses when shipped
- Add tracking numbers
- Assign orders to ranchers
- Handle refunds/cancellations

---

## Support

For issues or questions:
- Check Cloudflare Worker logs
- Check Stripe webhook logs
- Review Google Sheets sharing permissions
- Verify all environment variables are set

---

## Next Steps

Once system is running:

1. **Scale Operations:**
   - Automate rancher assignment
   - Integrate with processing facilities
   - Add email notifications

2. **Enhance Security:**
   - Implement OAuth for admin dashboard
   - Add role-based permissions
   - Enable audit logging

3. **Add Features:**
   - Automated inventory tracking
   - Customer order tracking portal
   - Rancher payment automation

---

**System Status**: Ready for Production Phase 1

This system is production-ready for initial orders. Monitor closely and iterate based on actual usage.
