# HerdShare Spreadsheet Schema

## Sheet 1: ORDERS (Operations)

**Purpose**: Real-time order tracking for ranchers, processors, and fulfillment team

**Columns**:

| Column | Description | Example |
|--------|-------------|---------|
| Order ID | Unique order identifier | HS-2026-001 |
| Stripe Payment ID | Stripe transaction ID | ch_3Abc123 |
| Timestamp | Order date/time | 2026-01-11 14:30:00 |
| Status | Current order status | Pending / Processing / Shipped / Completed |
| Buyer Name | Organization/contact name | Alpha Beta Chapter |
| Organization Type | Fraternity / Institution / Community House | Fraternity |
| Contact Email | Primary contact email | president@alphabeta.org |
| Contact Phone | Phone number | (555) 123-4567 |
| Delivery Address | Full shipping address | 123 Greek Row, Austin TX 78705 |
| Product Type | Whole / Half / Quarter | Whole |
| Estimated Weight (lbs) | Retail cut weight | 475 |
| Price Paid | Total payment received | $4,750.00 |
| Cost Basis | Cost to fulfill (rancher + processing) | $3,500.00 |
| Margin | Price - Cost | $1,250.00 |
| Margin % | (Margin / Price) * 100 | 26.3% |
| Requested Delivery Window | Customer preference | Jan 15-20, 2026 |
| Assigned Rancher | Which ranch is fulfilling | Smith Family Ranch |
| Processing Facility | USDA processor | XYZ Meats, Lubbock TX |
| Scheduled Processing Date | When animal will be processed | Jan 14, 2026 |
| Scheduled Ship Date | When cuts will ship | Jan 18, 2026 |
| Tracking Number | Shipping tracking | 1Z999AA10123456784 |
| Notes | Special requests/issues | Extra ground beef requested |
| Last Updated | Last modification timestamp | 2026-01-11 15:00:00 |

**Default Values**:
- Status: "Pending"
- Cost Basis: Calculated based on product type
- Estimated Weight: 475 (whole), 237 (half), 118 (quarter)

---

## Sheet 2: ACCOUNTING (Finance)

**Purpose**: Revenue tracking, cost management, and financial reporting

**Columns**:

| Column | Description | Example |
|--------|-------------|---------|
| Order ID | Links to ORDERS sheet | HS-2026-001 |
| Order Date | Date order placed | 2026-01-11 |
| Month | Month for reporting | Jan 2026 |
| Product Type | Whole / Half / Quarter | Whole |
| Revenue | Price paid by customer | $4,750.00 |
| Rancher Cost | Payment to rancher | $2,800.00 |
| Processing Cost | USDA processing fee | $500.00 |
| Shipping Cost | Cold chain delivery | $200.00 |
| Total COGS | Sum of all costs | $3,500.00 |
| Gross Margin | Revenue - COGS | $1,250.00 |
| Margin % | (Gross Margin / Revenue) * 100 | 26.3% |
| Payment Status | Paid / Pending / Refunded | Paid |
| Rancher Paid | Has rancher been paid? | Yes / No |
| Rancher Payment Date | When rancher was paid | 2026-01-18 |
| Stripe Fee | Stripe transaction fee | $137.50 |
| Net Profit | Gross Margin - Stripe Fee | $1,112.50 |
| Net Margin % | (Net Profit / Revenue) * 100 | 23.4% |

**Summary Calculations** (at bottom of sheet):

- Total Orders (count)
- Total Revenue (sum)
- Total COGS (sum)
- Total Gross Margin (sum)
- Average Margin %
- Total Stripe Fees (sum)
- Total Net Profit (sum)
- Orders by Product Type (breakdown)
- Monthly Revenue Trend

---

## Pricing Reference

Default pricing and cost structure:

| Product | Retail Weight | Price/lb | Total Price | Rancher Cost | Processing | Shipping | Total COGS | Margin |
|---------|--------------|----------|-------------|--------------|------------|----------|------------|--------|
| Whole   | 475 lbs      | $10      | $4,750      | $2,800       | $500       | $200     | $3,500     | $1,250 |
| Half    | 237 lbs      | $10      | $2,370      | $1,400       | $300       | $150     | $1,850     | $520   |
| Quarter | 118 lbs      | $10      | $1,180      | $700         | $200       | $100     | $1,000     | $180   |

*Costs are estimates - actual costs may vary by rancher and processor*

---

## Order Status Workflow

1. **Pending** - Order received, payment confirmed
2. **Processing** - Assigned to rancher, animal scheduled for processing
3. **Shipped** - Cuts packaged and shipped to buyer
4. **Completed** - Delivered and confirmed
5. **Cancelled** - Order cancelled (rare)
6. **Refunded** - Payment refunded (rare)

---

## Data Validation Rules

- Order ID: Auto-generated, format HS-YYYY-NNN
- Status: Dropdown (Pending, Processing, Shipped, Completed, Cancelled, Refunded)
- Product Type: Dropdown (Whole, Half, Quarter)
- Dates: Date format validation
- Currency: Currency format ($X,XXX.XX)
- Percentages: Number format (XX.X%)

---

## Access Control

**Ranchers** (View-only):
- See ORDERS sheet only
- Filter to see only their assigned orders
- Cannot edit

**Admin/Operations** (Edit):
- Full access to ORDERS sheet
- Can update status, tracking, notes
- Cannot edit financial columns (auto-calculated)

**Finance** (View-only):
- Full access to ACCOUNTING sheet
- Can export for QuickBooks import

**Fulfillment Team** (Edit - Limited):
- Can update: Status, Tracking Number, Scheduled Dates
- Cannot edit: Pricing, Costs, Margins
