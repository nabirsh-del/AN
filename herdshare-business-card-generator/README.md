# 🐄 HerdShare Business Card Generator

**Print-ready business card generator using the HerdShare logo**

Generates professional business cards with bleed, safe zones, and proper specifications for commercial printing.

---

## Quick Start

### Two Generation Methods Available

**Method 1: Python (Recommended - Easiest)**
```bash
python3 generate-simple.py
```
✅ No installation needed! Python libraries installed automatically on first run.

**Method 2: Node.js (Advanced - HTML templates)**
```bash
npm install
npm run install-playwright
npm run generate
```
Better for complex designs with custom HTML/CSS, but requires more setup.

---

### For Most Users: Use Python Method

### 1. Edit Contact Info

Edit `config.json`:

```json
{
  "name": "Your Name",
  "title": "Your Title | HerdShare",
  "email": "yourname@herdshare.com",
  "phone": "+1 (555) 123-4567",
  "website": "herdshare.com",
  "qr_url": "https://herdshare.com",
  "tagline": "American Beef. American Values."
}
```

### 2. Generate Cards

```bash
python3 generate-simple.py
```

That's it! PDFs will be in `/output` folder.

### 3. Optional: Add Your Logo

Replace the placeholder logo:
- `assets/herdshare-logo.svg` (or `.png`)

**Logo requirements:**
- High resolution (300 DPI minimum)
- Transparent background preferred
- SVG format ideal (scales perfectly)
- PNG also works (at least 800px wide)

Output files will be in the `/output` folder.

---

## What You Get

### Three Design Variants

**Variant A - Minimal (White)**
- Clean white background
- Logo front, contact back
- Professional and versatile
- Best for: General use, conservative settings

**Variant B - Textured**
- Subtle gray gradient
- Light diagonal pattern overlay
- Premium feel
- Best for: Conferences, trade shows

**Variant C - Dark (Green)**
- Dark green gradient background
- White reversed logo
- Bold and modern
- Best for: Networking events, younger audience

### Output Files (Per Variant)

For each variant you get:
- **Front PDF** - Print-ready with bleed
- **Back PDF** - Print-ready with bleed
- **Front PNG** - Preview image
- **Back PNG** - Preview image

**Total:** 12 files (3 variants × 4 files each)

---

## Print Specifications

### Card Dimensions
- **Finished size:** 3.5" × 2.0"
- **With bleed:** 3.75" × 2.25"
- **Bleed:** 0.125" on all sides
- **Safe zone:** 0.125" inside trim
- **Resolution:** 300 DPI
- **Color mode:** RGB (printers will convert to CMYK)

### What is Bleed?

Bleed extends your design past the cut line to prevent white edges. The printer cuts at the trim line, so elements that extend to the edge must go into the bleed area.

**Never put text in the bleed area!** Keep all text and important elements in the safe zone (at least 0.125" from trim edge).

---

## Uploading to Printers

### Vistaprint

1. Go to Business Cards section
2. Choose "Upload Your Own"
3. Select "Standard (3.5 × 2)"
4. Upload FRONT PDF
5. Upload BACK PDF
6. Choose quantity and finish

**Recommended finish:** Matte or Glossy

### Moo

1. Choose "Business Cards"
2. Select "Upload Design"
3. Upload your PDF files
4. Moo will auto-detect bleed
5. Review proof carefully

**Moo tip:** Consider their premium finishes (raised spot gloss, gold foil)

### GotPrint / PrintRunner / Local Printer

1. Upload PDFs as provided
2. Specify: "Files have bleed included"
3. Do NOT add extra bleed
4. Request proof before final print

---

## Customization

### Changing Contact Info

Edit `config.json` and re-run `npm run generate`.

### Changing Logo

Replace `assets/herdshare-logo.svg` with your logo:
- Keep same filename, OR
- Update template files to reference new filename

### Changing Colors

Edit `config.json` colors section:

```json
"colors": {
  "primary": "#2c5f2d",     // Main brand green
  "secondary": "#97bc62",    // Light green accent
  "dark": "#1a3d1b",        // Dark green
  "text": "#333333",        // Text color
  "light": "#f8f9fa"        // Light background
}
```

### Changing Tagline

Edit `config.json`:

```json
"tagline": "Your custom tagline here"
```

Options:
- "American Beef. American Values."
- "Direct Supply for Independent American Beef."
- "Ranchers to Your Table."

### Creating Custom Variants

1. Duplicate an existing template (e.g., `variant-a-front.html`)
2. Rename it (e.g., `variant-d-front.html`)
3. Modify the CSS styles
4. Add to the variants array in `generate.js`

---

## File Structure

```
herdshare-business-card-generator/
├── assets/
│   └── herdshare-logo.svg          # Your logo here
├── templates/
│   ├── variant-a-front.html        # Minimal - Front
│   ├── variant-a-back.html         # Minimal - Back
│   ├── variant-b-front.html        # Textured - Front
│   ├── variant-c-front.html        # Dark - Front
│   └── variant-c-back.html         # Dark - Back
├── output/                          # Generated files appear here
├── config.json                      # Edit your contact info here
├── generate.js                      # Generator script
├── package.json                     # Dependencies
└── README.md                        # This file
```

---

## Troubleshooting

### "Cannot find module 'playwright'"

Run:
```bash
npm install
npm run install-playwright
```

### Logo not appearing

Make sure:
- Logo file exists in `assets/` folder
- Filename matches what's in templates
- Logo is valid SVG or PNG format

### QR code not showing

The generator creates QR codes automatically. If missing:
- Check that `qr_url` is set in config.json
- Verify QR code library installed (`npm install`)

### Colors look different when printed

Printers use CMYK, screens use RGB. Some color shift is normal. Request a proof print if color accuracy is critical.

### Text is cut off

Text must be in the **safe zone** (at least 0.125" from edge). Edit template to increase padding.

---

## Tips for Best Results

### Before Ordering

1. **Review PNG previews** - Look at output/*.png files
2. **Check spelling** - Verify name, email, phone
3. **Test QR code** - Scan with phone camera
4. **Print test page** - Print PNG on home printer to check layout
5. **Order proof** - Most printers offer digital or physical proofs

### Design Tips

✅ **Use high-contrast text** - Dark text on light background (or vice versa)
✅ **Keep it simple** - Don't overcrowd the card
✅ **Readable font size** - Minimum 8pt for body text
✅ **Test QR code** - Make sure it scans easily

❌ **Avoid tiny text** - Won't print clearly
❌ **Don't crowd edges** - Use safe zone
❌ **Skip busy backgrounds** - Hard to read

### Printing Tips

- **Order samples first** - Get 25-50 cards to test
- **Choose good paper** - 14pt or 16pt cardstock minimum
- **Consider finish** - Matte (professional), Glossy (modern), Uncoated (natural)
- **Round corners** - Optional but modern look
- **Spot UV** - Premium option to make logo pop

---

## Paper Stock Recommendations

| Stock | Feel | Best For |
|-------|------|----------|
| **14pt Matte** | Professional, easy to write on | General business |
| **16pt Glossy** | Premium, vibrant colors | Creative industries |
| **18pt Uncoated** | Natural, high-end | Premium brand image |
| **32pt Ultra Thick** | Luxury, substantial | Executive/VIP |

**HerdShare recommendation:** 16pt Matte or Uncoated (fits brand values: quality, substance, American-made feel)

---

## Cost Estimates

Based on 2024 prices:

| Quantity | Vistaprint | Moo | GotPrint |
|----------|-----------|-----|----------|
| 50       | ~$10      | ~$20| ~$12     |
| 100      | ~$15      | ~$28| ~$15     |
| 250      | ~$25      | ~$45| ~$25     |
| 500      | ~$35      | ~$70| ~$35     |

**Note:** Prices vary by finish, shipping, and current promotions. Premium finishes (spot UV, foil, thick stock) cost more.

---

## Advanced Features

### Adding Variable Data

Want to generate multiple cards with different names?

1. Create `contacts.json` with array of people:
```json
[
  {"name": "John Smith", "email": "john@herdshare.com", ...},
  {"name": "Jane Doe", "email": "jane@herdshare.com", ...}
]
```

2. Modify `generate.js` to loop through contacts array

### Two-Sided PDF for Printers

Some printers want a single PDF with front and back. Use a PDF merge tool:
- Mac: Preview (File → Export as PDF with both open)
- Windows: Adobe Acrobat
- Online: ilovepdf.com

### Custom Sizes

To change card size, edit `CARD_SPECS` in `generate.js`:

```javascript
const CARD_SPECS = {
    width: 1125,  // 3.75" × 300 DPI
    height: 675,  // 2.25" × 300 DPI
    dpi: 300
};
```

European size: 85mm × 55mm = 1004px × 650px at 300 DPI

---

## Support

### Questions?

1. Check this README first
2. Review template HTML/CSS files
3. Test with default placeholder logo first
4. Contact your printer's support for upload issues

### Common Printer Support Contacts

- **Vistaprint:** help.vistaprint.com
- **Moo:** moo.com/help
- **GotPrint:** gotprint.com/support
- **PrintRunner:** printrunner.com/help

---

## License

This generator is provided for HerdShare business use. Modify as needed for your team.

---

## Version History

- **v1.0** - Initial release with 3 variants, QR codes, print-ready PDFs

---

**Built for HerdShare** 🐄🇺🇸

American beef. American values. American business cards.
