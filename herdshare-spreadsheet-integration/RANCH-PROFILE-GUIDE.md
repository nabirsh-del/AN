# Ranch Profile Guide

**How to create ranch profile pages for HerdShare partner ranches**

---

## Overview

Each HerdShare partner ranch gets their own profile page that tells their story, explains their practices, and shows customers exactly where their beef comes from. This builds trust, transparency, and connection between customers and ranchers.

---

## Template File

**`ranch-profile.html`** - Complete ranch profile page template
**`ranch-profile-style.css`** - Styling for ranch pages

---

## How to Create a New Ranch Profile

### Step 1: Duplicate Template

```bash
cp ranch-profile.html ranch-profile-[ranch-name].html
```

Example: `ranch-profile-smith-family.html`

### Step 2: Update Content

Replace the following sections with ranch-specific information:

#### 1. **Page Title & Header** (Lines 5-6)
```html
<title>Smith Family Ranch - HerdShare</title>
```
Change to: `[Ranch Name] - HerdShare`

#### 2. **Ranch Hero Section** (Lines 23-31)
Update:
- Ranch name
- Location (city, state)
- Established year
- Tagline/motto

```html
<h1>Smith Family Ranch</h1>
<p class="location">📍 Lubbock, Texas • Est. 1987</p>
<p class="tagline">Four generations of Texas cattle ranching</p>
```

#### 3. **Quick Stats** (Lines 35-55)
Update with ranch-specific numbers:
- Total acreage
- Number of cattle (head count)
- Generations in business
- Key practices (Grass-fed %, Organic, etc.)

#### 4. **The Rancher's Story** (Lines 61-92)
This is the MOST IMPORTANT section. Include:
- Rancher names
- Family history
- How they got into ranching
- Their philosophy
- Personal quote
- What makes them unique

**Information to gather:**
- Full names of owners/operators
- Background story (2-3 paragraphs)
- Education/training
- Why they do what they do
- Personal quote about their approach

#### 5. **How They Raise Cattle** (Lines 101-162)
Update the 6 detail cards with ranch-specific practices:

**Standard practices to cover:**
1. Grass-fed / Grain-finished / Feed program
2. Antibiotics/hormones policy
3. Water sources
4. Grazing methods (rotational, etc.)
5. Handling practices
6. Certifications (USDA Organic, GAP, etc.)

#### 6. **Product Cut Breakdown** (Already standardized)
The cuts and weights are standardized across HerdShare, so you typically don't need to change this section. However, if a ranch offers custom cutting or specialty cuts, you can modify.

#### 7. **Optional: Add Photos**
Replace image placeholders with actual ranch photos:

```html
<!-- Replace this: -->
<div class="image-placeholder">
    <p>📷 Photo: John & Sarah Smith with their herd</p>
</div>

<!-- With this: -->
<img src="/images/smith-ranch-owners.jpg" alt="John and Sarah Smith">
```

**Photos needed:**
- Rancher portrait (for story section)
- Ranch landscape (for hero background)
- Cattle on pasture
- Ranch operation photos (optional)

---

## Ranch Information Checklist

When onboarding a new ranch partner, collect this information:

### Basic Info
- [ ] Ranch name
- [ ] Location (city, state)
- [ ] Year established
- [ ] Total acreage
- [ ] Number of cattle
- [ ] Generations in business

### Rancher(s)
- [ ] Full names
- [ ] Background/education
- [ ] How they got into ranching
- [ ] Family history
- [ ] Personal philosophy quote

### Practices
- [ ] Feed program (grass-fed, grain-finished, etc.)
- [ ] Hormone use policy
- [ ] Antibiotic use policy
- [ ] Water sources
- [ ] Grazing method
- [ ] Handling approach
- [ ] Processing facility used
- [ ] Certifications (if any)

### Unique Story Elements
- [ ] What makes this ranch special?
- [ ] Conservation efforts
- [ ] Community involvement
- [ ] Awards or recognition
- [ ] Generational traditions
- [ ] Unique practices

### Photos
- [ ] Rancher portrait (high-res)
- [ ] Ranch landscape
- [ ] Cattle photos
- [ ] Family photos (optional)
- [ ] Ranch operation photos

### Contact (for internal use)
- [ ] Ranch email
- [ ] Ranch phone
- [ ] Preferred processing facility
- [ ] Delivery logistics contact

---

## Writing Guidelines

### Voice & Tone
- **Authentic** - Real stories, not marketing fluff
- **Conversational** - Write like the rancher is talking
- **Transparent** - Honest about practices
- **Respectful** - Honor the rancher's work and tradition
- **Educational** - Help customers understand ranching

### Story Structure
1. **Hook** - Start with what makes this ranch unique
2. **Background** - Family history, how it started
3. **Philosophy** - Why they ranch the way they do
4. **Practices** - How they actually raise cattle
5. **Connection** - Link to HerdShare mission

### What to Include
✅ Specific details (acreage, cattle count, years)
✅ Personal anecdotes
✅ Direct quotes from rancher
✅ Challenges they've overcome
✅ What they're proud of
✅ Connection to land and animals

### What to Avoid
❌ Generic marketing language
❌ Exaggerated claims
❌ Industry jargon without explanation
❌ Comparing negatively to other ranches
❌ Unverified claims
❌ Overpromising

---

## Example Ranch Profile Content

### Good Example - Story Section

```
The Smith Family Ranch has been raising cattle in West Texas for over 35 years.
What started with John's grandfather on 400 acres has grown into a fourth-generation
operation spanning 2,400 acres of Texas grassland.

John grew up learning ranching from his father, who learned from his father before him.
After studying agriculture at Texas Tech, John returned home to continue the family tradition.
His wife Sarah, a former agricultural extension agent, brought modern sustainable practices
to the operation.

"We raise cattle the right way," John explains. "Our animals spend their entire lives on
pasture, eating grass like they're meant to. No feedlots, no growth hormones, no shortcuts.
Just good land, clean water, and time."
```

**Why this works:**
- Specific details (35 years, 400 → 2,400 acres, Texas Tech)
- Personal story (John, Sarah, grandfather)
- Direct quote in rancher's voice
- Clear practices (grass-fed, no shortcuts)
- Authentic tone

### Bad Example

```
Our ranch is the best in Texas! We use cutting-edge technology and revolutionary methods
to produce the highest quality beef you've ever tasted. Our cattle are the happiest
cattle in America!
```

**Why this doesn't work:**
- Generic claims ("best", "highest quality")
- No specific details
- Marketing language
- Unverifiable statements
- No personal connection

---

## Photo Guidelines

### Rancher Portrait
- High resolution (at least 1200px wide)
- Natural setting (on ranch, with cattle)
- Good lighting (golden hour ideal)
- Genuine expression (not overly posed)
- Shows connection to land/animals

### Ranch Landscape
- Wide shot showing pasture/terrain
- Cattle visible (if possible)
- Represents typical ranch environment
- Good weather/lighting
- High resolution for hero background

### Cattle Photos
- Show animals on pasture (not feedlot)
- Healthy, calm cattle
- Natural behavior
- Demonstrates grazing practices
- Various angles/distances

---

## Publishing Checklist

Before publishing a new ranch profile:

- [ ] All information verified with rancher
- [ ] Photos approved by rancher
- [ ] Quote is accurate and approved
- [ ] Practices accurately described
- [ ] Location is correct
- [ ] Stats are up-to-date
- [ ] Links work (order form, etc.)
- [ ] Mobile responsive (test on phone)
- [ ] Spelling/grammar checked
- [ ] Rancher has reviewed final page

---

## URL Structure

Ranch profile URLs should be:
- Lowercase
- Hyphenated
- Descriptive
- Consistent

**Format:** `herdshare.com/ranch/[ranch-name]`

Examples:
- `herdshare.com/ranch/smith-family`
- `herdshare.com/ranch/broken-arrow`
- `herdshare.com/ranch/red-river-cattle`

---

## Updating Profiles

Ranch profiles should be reviewed and updated:
- **Annually** - Check all info is current
- **When practices change** - Update immediately
- **When ownership changes** - Full update
- **When photos improve** - Replace as better ones available
- **When certifications change** - Update badges/mentions

---

## Ranch Directory Page

Create a main directory listing all partner ranches:

**`ranches.html`** - All ranches overview page

Should include:
- Grid of ranch cards
- Filter by location/state
- Filter by practices (organic, grass-fed, etc.)
- Search functionality
- Map view (future enhancement)

Each card shows:
- Ranch name
- Location
- Quick stats (acreage, cattle)
- Featured photo
- Link to full profile

---

## Integration with Ordering System

### Assigning Orders to Ranches

In the Orders spreadsheet (ORDERS sheet, column Q):
- "Assigned Rancher" field
- Select from dropdown of partner ranches
- Links order to specific ranch

### Ranch Dashboard Access

Ranchers can be given read-only access to:
- Orders assigned to them
- Their revenue/payment tracking
- Delivery schedules

Use the "rancher" role in admin dashboard.

---

## SEO Considerations

### Page Title
```html
<title>[Ranch Name] - [Location] Grass-Fed Beef | HerdShare</title>
```

### Meta Description
```html
<meta name="description" content="Meet [Ranch Name], a [generation]
family cattle ranch in [Location]. Learn about their [practice] approach
to raising quality beef and order direct.">
```

### Alt Text for Photos
```html
<img src="ranch-photo.jpg" alt="John Smith, owner of Smith Family Ranch,
standing with cattle on pasture in Lubbock, Texas">
```

---

## Future Enhancements

**Phase 2 Features:**
- Video interviews with ranchers
- Virtual ranch tours (360° photos)
- Customer reviews/testimonials
- Ranch blog/updates
- Seasonal availability updates
- Behind-the-scenes photos
- Ranch newsletter signups

**Phase 3 Features:**
- Live inventory tracking
- Ranch webcams
- Direct messaging with rancher
- Visit scheduling
- Educational content library
- Recipe pairings by ranch

---

## Template Variables Reference

Quick reference for customizing template:

| Section | What to Change |
|---------|---------------|
| `<title>` | Ranch name |
| Hero H1 | Ranch name |
| Hero location | City, State, Year |
| Hero tagline | Ranch motto/description |
| Stat 1 | Total acreage |
| Stat 2 | Number of cattle |
| Stat 3 | Generations |
| Stat 4 | Key practice |
| Story H3 | Rancher names |
| Story paragraphs | Ranch history & philosophy |
| Blockquote | Personal quote from rancher |
| Detail cards (6) | Ranch-specific practices |
| Photo placeholders | Actual ranch photos |

---

## Support

Questions about creating ranch profiles?
- Review existing example (Smith Family Ranch)
- Follow this guide step-by-step
- Collect all information before starting
- Get rancher approval before publishing

---

**Remember:** These profiles represent real families and their life's work.
Take the time to tell their story authentically and with respect. This is what
sets HerdShare apart—real relationships with real American ranchers.
