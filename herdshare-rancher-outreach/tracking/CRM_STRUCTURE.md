# HerdShare — CRM Structure & Data Tracking System

## Purpose

This document outlines a simple, Google Sheets-based CRM (Customer Relationship Management) system for tracking rancher leads, interactions, and conversions.

**Goal:** Maintain organized records of every rancher contact, enabling systematic follow-up and performance measurement.

---

## System Overview

### Why Google Sheets?

For early-stage lead generation, Google Sheets is ideal because:
- ✅ Free and accessible
- ✅ Real-time collaboration
- ✅ Easy filtering and sorting
- ✅ Simple to export and analyze
- ✅ No learning curve

**When to graduate to a full CRM:** When managing 500+ leads or 50+ active partnerships.

---

## Core Spreadsheet Structure

### Tab 1: Leads Pipeline

This is your main working sheet.

#### Required Columns

| Column Name | Data Type | Purpose | Example |
|------------|-----------|---------|---------|
| **Lead ID** | Auto-number | Unique identifier | LEAD-001 |
| **Rancher Name** | Text | Full name | John Miller |
| **Ranch Name** | Text | Business name | Miller Cattle Co. |
| **Phone** | Text | Primary contact number | (406) 555-0123 |
| **Email** | Text | Primary email | john@millercattle.com |
| **County** | Text | County location | Dawson County |
| **State** | Text | State | Montana |
| **Full Address** | Text | Physical ranch address | 1234 Ranch Rd, Glendive, MT |
| **Distance to Hub** | Number | Miles to nearest HerdShare hub | 85 |
| **Nearest Hub** | Text | Hub name | Billings Warehouse |
| **Est. Annual Head Count** | Number | Estimated annual throughput | 150 |
| **Current Sales Channel** | Dropdown | How they sell now | Auction / Local Buyer / Contract / Mixed |
| **Operation Type** | Dropdown | Business structure | Independent / Family / LLC / Corporate |
| **Lead Source** | Dropdown | Where you found them | Auction List / Cattlemen Assoc / Referral / LinkedIn / Facebook |
| **Referring Rancher** | Text | If referral, who referred | Tom Harris |
| **Lead Score** | Number (1-5) | Priority score | 4.5 |
| **Priority Tier** | Auto-calc | Based on score | Tier 1 |
| **Status** | Dropdown | Current stage | New / Contacted / Interested / Meeting Scheduled / Onboarded / Not Interested / On Hold |
| **First Contact Date** | Date | When you first reached out | 2026-01-15 |
| **Last Contact Date** | Date | Most recent interaction | 2026-01-22 |
| **Next Follow-Up Date** | Date | When to follow up next | 2026-01-29 |
| **Next Follow-Up Action** | Text | What to do next | "Schedule in-person visit" |
| **Interest Level** | Dropdown | Assessed interest | High / Medium / Low / None |
| **Notes** | Text (long) | Key details from conversations | "Frustrated with auction pricing, open to contracts, sells fall calves" |
| **Onboarding Date** | Date | Date of first delivery (if onboarded) | 2026-02-15 |
| **Owner/Assigned To** | Dropdown | Who's managing this lead | Sarah Johnson |

---

#### Dropdown Values (For Consistency)

**Current Sales Channel:**
- Auction (100%)
- Local Buyer (informal)
- Contracted (formal)
- Mixed (auction + contracts)
- DTC/Retail
- Unknown

**Operation Type:**
- Independent (owner-operator)
- Family LLC/Partnership
- Ranch Manager (hired)
- Regional Cooperative Member
- Corporate Subsidiary
- Unknown

**Lead Source:**
- Auction Consignor List
- State Cattlemen Association
- County Extension Referral
- Processor Referral
- Facebook Group
- LinkedIn
- Rancher Referral
- Industry Event
- Website Inquiry
- Other

**Status:**
- New (not yet contacted)
- Contacted (initial outreach sent)
- Responded (they replied)
- Conversation Held (phone/email dialogue)
- Interested (expressed interest in learning more)
- Meeting Scheduled (in-person or deep-dive call set)
- Onboarded (first delivery completed)
- Not Interested (declined partnership)
- On Hold (timing not right, revisit later)
- Lost (went with competitor or no longer viable)

**Interest Level:**
- High (actively interested, ready to move forward)
- Medium (curious, needs more info)
- Low (not priority for them right now)
- None (not interested)

**Priority Tier:**
- Tier 1 (Score 4.5-5.0)
- Tier 2 (Score 3.5-4.4)
- Tier 3 (Score 2.5-3.4)
- Tier 4 (Score 1.5-2.4)
- Tier 5 (Score 1.0-1.4)

---

### Tab 2: Interaction Log

Track every meaningful interaction (calls, emails, meetings).

#### Required Columns

| Column Name | Data Type | Purpose | Example |
|------------|-----------|---------|---------|
| **Interaction ID** | Auto-number | Unique ID | INT-001 |
| **Lead ID** | Lookup | Links to Leads Pipeline | LEAD-001 |
| **Rancher Name** | Auto-fill | Pulled from Leads tab | John Miller |
| **Date** | Date | When interaction occurred | 2026-01-18 |
| **Type** | Dropdown | Interaction type | Phone Call / Email Sent / Email Received / In-Person Meeting / Text Message |
| **Duration (min)** | Number | Length of call/meeting | 8 |
| **Outcome** | Dropdown | Result of interaction | Interested / Needs More Info / Not Interested / Meeting Scheduled / Voicemail Left / No Answer |
| **Summary** | Text (long) | Brief recap | "Discussed pricing model, rancher interested but wants to see contract draft first" |
| **Follow-Up Required?** | Checkbox | Yes/No | ✓ |
| **Follow-Up Date** | Date | When to follow up | 2026-01-25 |
| **Follow-Up Action** | Text | What to do next | "Send contract template via email" |
| **Logged By** | Text | Who logged this | Sarah Johnson |

---

### Tab 3: Onboarded Ranchers

Track active partnerships and performance.

#### Required Columns

| Column Name | Data Type | Purpose | Example |
|------------|-----------|---------|---------|
| **Rancher ID** | Auto-number | Unique ID | RANCH-001 |
| **Lead ID** | Lookup | Original lead record | LEAD-001 |
| **Rancher Name** | Text | Full name | John Miller |
| **Ranch Name** | Text | Business name | Miller Cattle Co. |
| **Onboarding Date** | Date | Date of first delivery | 2026-02-15 |
| **Contract Start Date** | Date | Contract effective date | 2026-02-01 |
| **Contract End Date** | Date | Contract expiration (if applicable) | 2027-02-01 |
| **Annual Volume (Head)** | Number | Contracted head count | 120 |
| **YTD Deliveries (Head)** | Number | Delivered so far this year | 45 |
| **Payment Terms** | Text | Net X days | Net 30 |
| **Primary Contact** | Text | Main point of contact | John Miller |
| **Secondary Contact** | Text | Backup contact | Mary Miller |
| **Referrals Provided** | Number | How many referrals given | 2 |
| **Referral Incentive Earned** | Text | What they've earned | Tier 1: Priority Allocation |
| **Status** | Dropdown | Partnership status | Active / On Hold / Churned |
| **Last Delivery Date** | Date | Most recent delivery | 2026-03-10 |
| **Next Scheduled Delivery** | Date | Upcoming delivery | 2026-04-15 |
| **Notes** | Text | Partnership details | "Prefers fall delivery, excellent communication" |

---

### Tab 4: Referral Tracking

Track referrals from existing rancher partners.

#### Required Columns

| Column Name | Data Type | Purpose | Example |
|------------|-----------|---------|---------|
| **Referral ID** | Auto-number | Unique ID | REF-001 |
| **Referring Rancher ID** | Lookup | Who made the referral | RANCH-001 |
| **Referring Rancher Name** | Auto-fill | Name | John Miller |
| **Referred Rancher Name** | Text | New lead name | Tom Harris |
| **Referred Ranch Name** | Text | New lead business | Harris Cattle LLC |
| **Referred Phone** | Text | Contact info | (406) 555-9876 |
| **Referred Email** | Text | Email | tom@harriscattle.com |
| **Referral Date** | Date | When referral was made | 2026-03-01 |
| **Lead ID** | Lookup | Lead record (once created) | LEAD-045 |
| **Status** | Dropdown | Referral status | New / Contacted / Interested / Onboarded / Not Interested |
| **Onboarding Date** | Date | If successful | 2026-04-10 |
| **Incentive Earned** | Text | What referring rancher gets | Tier 1: Priority Allocation |
| **Incentive Awarded Date** | Date | When incentive was given | 2026-04-15 |

---

### Tab 5: Success Metrics Dashboard

Weekly/monthly performance tracking.

#### Required Columns

| Column Name | Data Type | Purpose | Example |
|------------|-----------|---------|---------|
| **Week/Month** | Date | Reporting period | Week of 2026-01-13 |
| **Leads Added** | Number | New leads sourced | 42 |
| **Leads Contacted** | Number | Outreach attempts | 35 |
| **Conversations Held** | Number | Meaningful dialogues (>2 min) | 18 |
| **Meetings Scheduled** | Number | In-person or deep calls set | 4 |
| **Ranchers Onboarded** | Number | New partnerships | 2 |
| **Referrals Received** | Number | Referrals from existing partners | 3 |
| **Avg Lead Score** | Number | Average score of new leads | 3.2 |
| **Avg Distance to Hub (mi)** | Number | Average proximity | 95 |
| **Conversion Rate (%)** | Calc | (Onboarded / Contacted) × 100 | 5.7% |
| **Cost per Lead** | Number | Spend / Leads Added | $22 |
| **Cost per Onboarded Rancher** | Number | Total spend / Onboarded | $485 |
| **Active Partnerships** | Number | Total onboarded ranchers | 12 |
| **Notes** | Text | Weekly observations | "High interest from Dawson County ranchers" |

---

## Google Sheets Formulas & Automation

### Auto-Calculate Priority Tier (Leads Pipeline, Column "Priority Tier")

```
=IF(R2>=4.5,"Tier 1",IF(R2>=3.5,"Tier 2",IF(R2>=2.5,"Tier 3",IF(R2>=1.5,"Tier 4","Tier 5"))))
```

*Assumes Lead Score is in column R*

---

### Auto-Flag Overdue Follow-Ups (Conditional Formatting)

**Rule:** If "Next Follow-Up Date" < TODAY() and Status ≠ "Onboarded" or "Not Interested", highlight row red.

**Setup:**
1. Select "Next Follow-Up Date" column
2. Format → Conditional Formatting
3. Custom formula: `=AND(S2<TODAY(), OR(Q2<>"Onboarded", Q2<>"Not Interested"))`
4. Format: Red background

*Assumes Next Follow-Up Date is column S, Status is column Q*

---

### Count Leads by Status (Dashboard)

```
=COUNTIF('Leads Pipeline'!Q:Q,"Interested")
```

*Counts all leads with Status = "Interested"*

---

### Calculate Conversion Rate (Dashboard)

```
=(E2/D2)*100
```

*E2 = Ranchers Onboarded, D2 = Leads Contacted*

---

## Data Entry Best Practices

### ✅ Do:

1. **Log every interaction within 30 minutes** (while details are fresh)
2. **Use consistent naming** (e.g., always "John Miller," not "J. Miller" or "Miller, John")
3. **Update "Last Contact Date" and "Next Follow-Up Date" after every touch**
4. **Add detailed notes** (pain points, objections, personal details)
5. **Re-score leads quarterly** as new info emerges
6. **Archive "Lost" and "Not Interested" leads** (move to separate tab, don't delete)

### ❌ Don't:

1. **Leave fields blank** (use "Unknown" if you don't have data)
2. **Use abbreviations inconsistently** (MT vs. Montana—pick one)
3. **Log duplicate entries** (check for existing lead first)
4. **Forget to log "no answer" calls** (track all outreach attempts)
5. **Let follow-ups go overdue** (review dashboard daily)

---

## Weekly CRM Maintenance Routine

### Monday Morning (15 minutes)
- Review "Next Follow-Up Date" column
- Flag overdue follow-ups
- Prioritize week's outreach (Tier 1 leads first)

### Wednesday Afternoon (10 minutes)
- Update interaction log for all calls/emails from Mon-Wed
- Adjust lead scores based on new intel

### Friday End-of-Day (20 minutes)
- Log all remaining interactions
- Update Success Metrics Dashboard for the week
- Plan next week's outreach targets

---

## Sample Google Sheets Template Structure

### Sheet Tabs:
1. **Leads Pipeline** (main working tab)
2. **Interaction Log** (every touch logged)
3. **Onboarded Ranchers** (active partnerships)
4. **Referral Tracking** (referral flywheel)
5. **Success Metrics Dashboard** (weekly KPIs)
6. **Archive - Not Interested** (inactive leads)
7. **Archive - Lost** (leads who went elsewhere)

---

## Data Security & Access

### Who Should Have Access?

| Role | Access Level | Why |
|------|-------------|-----|
| **Lead Generation Team** | Edit | Need to add leads and log interactions |
| **Sales/Partnership Team** | Edit | Managing onboarded relationships |
| **Leadership** | View Only | Monitor performance, no data entry |
| **External Partners** | No Access | Keep rancher data confidential |

### Privacy Notes:
- **Do NOT share rancher contact info** with third parties
- **Limit access** to HerdShare team only
- **Back up weekly** (Google Sheets auto-saves, but export to .csv weekly)

---

## Sample Data Entry (Example Lead)

### Leads Pipeline Entry:

| Field | Value |
|-------|-------|
| Lead ID | LEAD-042 |
| Rancher Name | Tom Harris |
| Ranch Name | Harris Cattle LLC |
| Phone | (406) 555-9876 |
| Email | tom@harriscattle.com |
| County | Dawson County |
| State | Montana |
| Full Address | 5678 County Road 12, Glendive, MT 59330 |
| Distance to Hub | 92 miles |
| Nearest Hub | Billings Warehouse |
| Est. Annual Head Count | 180 |
| Current Sales Channel | Auction (100%) |
| Operation Type | Independent (owner-operator) |
| Lead Source | Rancher Referral |
| Referring Rancher | John Miller (RANCH-001) |
| Lead Score | 4.8 |
| Priority Tier | Tier 1 |
| Status | Contacted |
| First Contact Date | 2026-03-05 |
| Last Contact Date | 2026-03-05 |
| Next Follow-Up Date | 2026-03-08 |
| Next Follow-Up Action | Phone call—discuss pricing and contract terms |
| Interest Level | High |
| Notes | Referred by John Miller. Frustrated with auction price swings. Sells 180 head/year, mostly fall calves. Very interested in predictable pricing. Follow up ASAP. |

---

### Interaction Log Entry:

| Field | Value |
|-------|-------|
| Interaction ID | INT-087 |
| Lead ID | LEAD-042 |
| Rancher Name | Tom Harris |
| Date | 2026-03-05 |
| Type | Phone Call |
| Duration (min) | 12 |
| Outcome | Interested |
| Summary | Initial call. Tom expressed strong interest in alternative to auction. Discussed HerdShare model—predictable demand, transparent pricing. Asked about payment terms (Net 30). Wants to see contract template. Very engaged, asked lots of questions. High priority follow-up. |
| Follow-Up Required? | ✓ |
| Follow-Up Date | 2026-03-08 |
| Follow-Up Action | Call to discuss pricing specifics and send contract template |
| Logged By | Sarah Johnson |

---

## CRM Success Metrics

Track these monthly to measure system health:

| Metric | Target | Notes |
|--------|--------|-------|
| **Data Completeness** | >95% | % of required fields filled |
| **Follow-Up Adherence** | >90% | % of follow-ups completed on time |
| **Lead-to-Onboard Conversion** | 5-10% | Industry benchmark for B2B ag |
| **Avg Time to Onboard** | 30-60 days | From first contact to first delivery |
| **CRM Update Frequency** | Daily | Team logs interactions within 24 hours |

---

## When to Upgrade from Sheets

Move to a dedicated CRM (HubSpot, Salesforce, Pipedrive) when:
- Managing 500+ leads
- 3+ team members using the system daily
- Needing email automation integration
- Requiring advanced reporting/forecasting

**Until then, Google Sheets is sufficient.**

---

## Next Steps

1. **Copy the Google Sheets template** (create from structure above)
2. **Import your first 20-50 leads** from lead generation efforts
3. **Train your team** on data entry best practices
4. **Set up weekly review cadence** (Mondays for follow-ups, Fridays for metrics)
5. **Refine fields** based on what info proves most valuable

---

## Appendix: Google Sheets Template Link

**[Create your own copy of the HerdShare CRM Template](#)**

*Instructions:*
1. File → Make a Copy
2. Rename to "HerdShare Rancher CRM - [Your Region]"
3. Share with your team (edit access for lead gen, view for leadership)
4. Start logging leads!

---

**Version 1.0** — January 2026
