# Business Card Generator - Usage Guide

**Step-by-step instructions for creating your HerdShare business cards**

---

## Part 1: Setup (One-Time)

### Step 1: Install Node.js

If you don't have Node.js installed:

**Mac:**
```bash
brew install node
```

**Windows:**
Download from https://nodejs.org

**Check installation:**
```bash
node --version
# Should show v18.x or higher
```

### Step 2: Navigate to Generator Folder

```bash
cd herdshare-business-card-generator
```

### Step 3: Install Dependencies

```bash
npm install
```

This downloads required libraries (takes ~1 minute).

### Step 4: Install Playwright Browser

```bash
npm run install-playwright
```

This downloads Chromium for PDF generation (takes ~2 minutes).

**You're done with setup!** You only need to do this once.

---

## Part 2: Add Your Logo (One-Time)

### Option A: You Have SVG Logo (Best)

1. Save your logo as `herdshare-logo.svg`
2. Copy it to `/assets` folder
3. Replace the existing placeholder file

**SVG Benefits:**
- Scales perfectly at any size
- No pixelation
- Smallest file size
- Best for printing

### Option B: You Have PNG Logo

1. Make sure PNG is at least 800px wide
2. Has transparent background (preferred)
3. At least 300 DPI for print quality
4. Rename to `herdshare-logo.png`
5. Copy to `/assets` folder
6. Edit templates to change `.svg` to `.png` in image src

### Option C: You Have No Logo Yet

The generator includes a placeholder logo (green circle with cow emoji + "HerdShare" text). You can:
- Use it for testing
- Replace it later when you have the real logo

---

## Part 3: Customize Contact Info

### Edit config.json

Open `config.json` in any text editor:

```json
{
  "name": "Nikolai Birsh",
  "title": "Founder | HerdShare",
  "email": "nikolai@herdshare.com",
  "phone": "+1 (555) 123-4567",
  "website": "herdshare.com",
  "qr_url": "https://herdshare.com",
  "tagline": "American Beef. American Values.",
  "colors": {
    "primary": "#2c5f2d",
    "secondary": "#97bc62",
    "dark": "#1a3d1b",
    "text": "#333333",
    "light": "#f8f9fa"
  }
}
```

### Change These Fields:

**name** - Your full name as it appears on card

**title** - Your role/title
- Examples: "Founder | HerdShare", "Partner", "Director of Operations"

**email** - Your HerdShare email

**phone** - Your contact number
- Format: "+1 (555) 123-4567" or "555-123-4567"

**website** - Usually "herdshare.com"

**qr_url** - Where QR code links to
- Options: "https://herdshare.com", "https://herdshare.com/your-profile", your LinkedIn

**tagline** - Appears on back of card
- Default: "American Beef. American Values."
- Alternatives: "Direct Supply for Independent American Beef.", "Ranchers to Your Table."

**colors** - Only change if you have specific brand colors different from default green

### Save the File

After editing, save `config.json`.

---

## Part 4: Generate Business Cards

### Run Generator

```bash
npm run generate
```

### What Happens:

1. Loads your config
2. Generates QR code
3. Launches browser
4. Renders each card design
5. Exports PDFs and PNGs
6. Saves to `/output` folder

**Takes about 10-20 seconds.**

### Expected Output

```
🐄 HerdShare Business Card Generator

Loading configuration...
  Name: Nikolai Birsh
  Title: Founder | HerdShare
  Email: nikolai@herdshare.com

Generating QR code...
  ✓ QR code generated

Starting browser...

=== Variant A (Minimal) ===
Generating herdshare-card-a-front...
  ✓ PDF: output/herdshare-card-a-front.pdf
  ✓ PNG: output/herdshare-card-a-front.png
Generating herdshare-card-a-back...
  ✓ PDF: output/herdshare-card-a-back.pdf
  ✓ PNG: output/herdshare-card-a-back.png

=== Variant B (Textured) ===
[...]

=== Variant C (Dark) ===
[...]

✅ All business cards generated successfully!
```

---

## Part 5: Review Your Cards

### Open Output Folder

```bash
cd output
ls
```

You'll see 12 files:
- 6 PDFs (3 front, 3 back)
- 6 PNGs (3 front, 3 back)

### View PNG Previews

Open the PNG files to see what each variant looks like:

**Variant A (Minimal)**
- `herdshare-card-a-front.png` - White background, centered logo
- `herdshare-card-a-back.png` - Contact info, white background

**Variant B (Textured)**
- `herdshare-card-b-front.png` - Subtle gray texture, logo with shadow
- `herdshare-card-b-back.png` - Same as Variant A back

**Variant C (Dark)**
- `herdshare-card-c-front.png` - Dark green gradient, white logo
- `herdshare-card-c-back.png` - Dark green, white text, color accents

### Check These Things:

- [ ] Name spelled correctly
- [ ] Email is correct
- [ ] Phone number formatted well
- [ ] Website is correct
- [ ] QR code is visible
- [ ] Logo looks good (not pixelated)
- [ ] Text is readable
- [ ] Design looks professional

**If something needs fixing:**
1. Edit `config.json`
2. Run `npm run generate` again
3. Check new output

---

## Part 6: Order from Printer

### Choose Your Favorite Variant

Look at all three PNGs and decide which style you like best:
- Variant A: Clean, versatile, safe choice
- Variant B: Premium, subtle texture
- Variant C: Bold, modern, stands out

### Prepare Files for Upload

You need to upload TWO PDF files:
1. **Front PDF** (e.g., `herdshare-card-a-front.pdf`)
2. **Back PDF** (e.g., `herdshare-card-a-back.pdf`)

### Go to Printer Website

**Recommended printers:**

1. **Vistaprint** (vistaprint.com)
   - Affordable
   - Fast shipping
   - Good quality
   - Best for: First-time orders, high volume

2. **Moo** (moo.com)
   - Premium quality
   - Better paper stock
   - Premium finishes available
   - Best for: Premium brand image

3. **GotPrint** (gotprint.com)
   - Good balance of quality/price
   - Fast turnaround
   - Best for: Repeat orders

### Example: Ordering from Vistaprint

**Step 1:** Go to vistaprint.com → Business Cards

**Step 2:** Click "Upload Your Own Design"

**Step 3:** Select options:
- Size: Standard (3.5" × 2")
- Quantity: 50 (for first order)
- Finish: Matte or Glossy

**Step 4:** Upload files:
- Upload `herdshare-card-a-front.pdf` as Front
- Upload `herdshare-card-a-back.pdf` as Back

**Step 5:** Review proof:
- Vistaprint shows preview
- Check that front/back are correct
- Verify text is not cut off

**Step 6:** Add to cart and checkout

**Step 7:** Wait 3-5 business days for delivery

---

## Part 7: Testing Before Big Order

### Print Test at Home

1. Open PNG file on your computer
2. Print on regular paper (8.5" × 11")
3. Use scissors to cut to card size
4. Check readability and layout

**Not for distribution** - just for testing layout.

### Order Small Batch First

Order 25-50 cards initially:
- Check print quality
- Test paper stock
- Verify colors
- Test QR code with phone camera

**If everything looks good**, order larger quantity (250-500).

---

## Part 8: Updating for Team Members

### Generate Cards for Multiple People

**Option 1: One at a Time**

1. Edit `config.json` with person's info
2. Run `npm run generate`
3. Rename output files (e.g., `john-smith-card-a-front.pdf`)
4. Repeat for next person

**Option 2: Batch Generation (Advanced)**

Create `team.json`:
```json
[
  {
    "name": "Nikolai Birsh",
    "title": "Founder",
    "email": "nikolai@herdshare.com",
    "phone": "(555) 123-4567"
  },
  {
    "name": "John Smith",
    "title": "Operations Manager",
    "email": "john@herdshare.com",
    "phone": "(555) 234-5678"
  }
]
```

Modify `generate.js` to loop through team array.

---

## Part 9: Troubleshooting

### "Command not found: npm"

You need to install Node.js first (see Step 1 in Setup).

### Logo is pixelated/blurry

Your logo file is too low resolution. You need:
- SVG format (ideal), OR
- PNG at least 800px wide and 300 DPI

### Text is cut off at edges

Text is too close to edge. Edit the template:
- Open `variant-a-back.html`
- Increase padding value (currently 75px)
- Change to 100px for more margin
- Regenerate

### QR code doesn't work

Test the QR code URL:
- Open your phone camera
- Point at QR code on screen
- Should open `https://herdshare.com`

If not working:
- Check `qr_url` in config.json
- Make sure URL includes https://
- Regenerate cards

### Colors look different on screen vs print

This is normal. Screens use RGB, printers use CMYK. Some color shift will occur. If exact color matching is critical, request a Pantone match from your printer (costs more).

### "Playwright not found"

Run:
```bash
npm run install-playwright
```

---

## Part 10: Tips for Best Results

### Before Ordering

✅ Print PNG preview at home
✅ Test QR code with phone camera
✅ Have someone proofread contact info
✅ Order small batch first (25-50)
✅ Request digital proof from printer

### Design Tips

✅ Keep design simple
✅ Use high contrast (dark text on light background)
✅ Avoid tiny text (minimum 8pt)
✅ Test QR code size (0.75" is minimum)
✅ Leave whitespace - don't crowd

### Printing Tips

✅ Use 14pt or 16pt cardstock (not thin)
✅ Matte finish is most professional
✅ Consider rounded corners (modern look)
✅ Order from reputable printer
✅ Keep extras for replacements

---

## Quick Reference

### Generate new cards:
```bash
npm run generate
```

### Edit contact info:
```
Open config.json, edit, save, regenerate
```

### Replace logo:
```
Copy new logo to /assets/herdshare-logo.svg
```

### View output:
```
Check /output folder for PDFs and PNGs
```

### Which files to upload to printer:
```
*-front.pdf and *-back.pdf (same variant)
```

---

## Still Have Questions?

1. Check README.md for detailed info
2. Review template HTML files to see structure
3. Test with placeholder logo first
4. Contact your printer's support for upload issues

**Remember:** The generator creates print-ready files. You should be able to upload directly to any major printer without modifications.

---

**Happy printing! 🐄🇺🇸**
