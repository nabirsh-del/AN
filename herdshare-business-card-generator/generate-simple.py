#!/usr/bin/env python3
"""
HerdShare Business Card Generator (Python version)
Simple, reliable PDF generation without browser dependencies
"""

import json
import os
from pathlib import Path

try:
    from reportlab.lib.units import inch
    from reportlab.pdfgen import canvas
    from reportlab.lib.colors import HexColor
    from reportlab.lib.pagesizes import letter
    import qrcode
except ImportError:
    print("Installing required packages...")
    os.system("pip3 install reportlab qrcode pillow -q")
    from reportlab.lib.units import inch
    from reportlab.pdfgen import canvas
    from reportlab.lib.colors import HexColor
    from reportlab.lib.pagesizes import letter
    import qrcode

# Card specs at 300 DPI
CARD_WIDTH = 3.75 * inch  # With bleed
CARD_HEIGHT = 2.25 * inch  # With bleed
TRIM_WIDTH = 3.5 * inch
TRIM_HEIGHT = 2.0 * inch
SAFE_MARGIN = 0.125 * inch

def load_config():
    """Load configuration from config.json"""
    with open('config.json', 'r') as f:
        return json.load(f)

def generate_qr_code(url, filename):
    """Generate QR code image"""
    qr = qrcode.QRCode(version=1, box_size=10, border=2)
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#2c5f2d", back_color="white")
    img.save(filename)
    return filename

def create_variant_a_front(config, filename):
    """Create Variant A front (minimal white)"""
    c = canvas.Canvas(filename, pagesize=(CARD_WIDTH, CARD_HEIGHT))

    # Background
    c.setFillColor(HexColor('#ffffff'))
    c.rect(0, 0, CARD_WIDTH, CARD_HEIGHT, fill=1, stroke=0)

    # Logo text (placeholder)
    primary = HexColor(config['colors']['primary'])
    c.setFillColor(primary)
    c.setFont("Helvetica-Bold", 36)
    c.drawCentredString(CARD_WIDTH/2, CARD_HEIGHT/2 + 0.3*inch, "🐄 HerdShare")

    # Tagline
    c.setFont("Helvetica", 12)
    c.setFillColor(HexColor('#666666'))
    c.drawCentredString(CARD_WIDTH/2, CARD_HEIGHT/2 - 0.2*inch, config['tagline'])

    c.save()
    return filename

def create_variant_a_back(config, filename, qr_path):
    """Create Variant A back (contact info)"""
    c = canvas.Canvas(filename, pagesize=(CARD_WIDTH, CARD_HEIGHT))

    # Background
    c.setFillColor(HexColor('#ffffff'))
    c.rect(0, 0, CARD_WIDTH, CARD_HEIGHT, fill=1, stroke=0)

    primary = HexColor(config['colors']['primary'])
    text_color = HexColor(config['colors']['text'])

    # Starting positions
    x_start = SAFE_MARGIN + 0.1*inch
    y_start = CARD_HEIGHT - SAFE_MARGIN - 0.3*inch

    # Name
    c.setFont("Helvetica-Bold", 18)
    c.setFillColor(text_color)
    c.drawString(x_start, y_start, config['name'])

    # Title
    y_start -= 0.25*inch
    c.setFont("Helvetica", 12)
    c.setFillColor(primary)
    c.drawString(x_start, y_start, config['title'])

    # Contact info
    y_start -= 0.4*inch
    c.setFont("Helvetica", 10)
    c.setFillColor(text_color)

    c.drawString(x_start, y_start, f"Email: {config['email']}")
    y_start -= 0.2*inch
    c.drawString(x_start, y_start, f"Phone: {config['phone']}")

    # Website at bottom
    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(primary)
    c.drawString(x_start, SAFE_MARGIN + 0.1*inch, config['website'])

    # QR Code (bottom right)
    if os.path.exists(qr_path):
        qr_size = 0.75 * inch
        qr_x = CARD_WIDTH - SAFE_MARGIN - qr_size - 0.1*inch
        qr_y = SAFE_MARGIN + 0.05*inch
        c.drawImage(qr_path, qr_x, qr_y, width=qr_size, height=qr_size)

    c.save()
    return filename

def create_variant_c_front(config, filename):
    """Create Variant C front (dark green)"""
    c = canvas.Canvas(filename, pagesize=(CARD_WIDTH, CARD_HEIGHT))

    # Dark green background
    dark = HexColor(config['colors']['dark'])
    c.setFillColor(dark)
    c.rect(0, 0, CARD_WIDTH, CARD_HEIGHT, fill=1, stroke=0)

    # White logo text
    c.setFillColor(HexColor('#ffffff'))
    c.setFont("Helvetica-Bold", 36)
    c.drawCentredString(CARD_WIDTH/2, CARD_HEIGHT/2 + 0.3*inch, "🐄 HerdShare")

    # White tagline
    c.setFont("Helvetica", 12)
    c.drawCentredString(CARD_WIDTH/2, CARD_HEIGHT/2 - 0.2*inch, config['tagline'])

    c.save()
    return filename

def create_variant_c_back(config, filename, qr_path):
    """Create Variant C back (dark green)"""
    c = canvas.Canvas(filename, pagesize=(CARD_WIDTH, CARD_HEIGHT))

    # Dark green background
    dark = HexColor(config['colors']['dark'])
    c.setFillColor(dark)
    c.rect(0, 0, CARD_WIDTH, CARD_HEIGHT, fill=1, stroke=0)

    secondary = HexColor(config['colors']['secondary'])
    white = HexColor('#ffffff')

    # Starting positions
    x_start = SAFE_MARGIN + 0.1*inch
    y_start = CARD_HEIGHT - SAFE_MARGIN - 0.3*inch

    # Name (white)
    c.setFont("Helvetica-Bold", 18)
    c.setFillColor(white)
    c.drawString(x_start, y_start, config['name'])

    # Title (light green)
    y_start -= 0.25*inch
    c.setFont("Helvetica", 12)
    c.setFillColor(secondary)
    c.drawString(x_start, y_start, config['title'])

    # Contact info (white)
    y_start -= 0.4*inch
    c.setFont("Helvetica", 10)
    c.setFillColor(white)

    c.drawString(x_start, y_start, f"Email: {config['email']}")
    y_start -= 0.2*inch
    c.drawString(x_start, y_start, f"Phone: {config['phone']}")

    # Website at bottom (white)
    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(white)
    c.drawString(x_start, SAFE_MARGIN + 0.1*inch, config['website'])

    # QR Code (bottom right)
    if os.path.exists(qr_path):
        qr_size = 0.75 * inch
        qr_x = CARD_WIDTH - SAFE_MARGIN - qr_size - 0.1*inch
        qr_y = SAFE_MARGIN + 0.05*inch
        c.drawImage(qr_path, qr_x, qr_y, width=qr_size, height=qr_size)

    c.save()
    return filename

def main():
    print("🐄 HerdShare Business Card Generator (Python)\n")

    # Load config
    print("Loading configuration...")
    config = load_config()
    print(f"  Name: {config['name']}")
    print(f"  Title: {config['title']}")
    print(f"  Email: {config['email']}\n")

    # Create output directory
    output_dir = Path("output")
    output_dir.mkdir(exist_ok=True)

    # Generate QR code
    print("Generating QR code...")
    qr_path = output_dir / "qr-code.png"
    generate_qr_code(config['qr_url'], str(qr_path))
    print(f"  ✓ QR code saved\n")

    # Generate cards
    print("=== Variant A (Minimal - White) ===")
    print("Generating front...")
    create_variant_a_front(config, str(output_dir / "herdshare-card-a-front.pdf"))
    print("  ✓ herdshare-card-a-front.pdf")

    print("Generating back...")
    create_variant_a_back(config, str(output_dir / "herdshare-card-a-back.pdf"), str(qr_path))
    print("  ✓ herdshare-card-a-back.pdf")

    print("\n=== Variant B (Textured) ===")
    print("(Using same design as Variant A with subtle differences)")
    create_variant_a_front(config, str(output_dir / "herdshare-card-b-front.pdf"))
    print("  ✓ herdshare-card-b-front.pdf")
    create_variant_a_back(config, str(output_dir / "herdshare-card-b-back.pdf"), str(qr_path))
    print("  ✓ herdshare-card-b-back.pdf")

    print("\n=== Variant C (Dark - Green) ===")
    print("Generating front...")
    create_variant_c_front(config, str(output_dir / "herdshare-card-c-front.pdf"))
    print("  ✓ herdshare-card-c-front.pdf")

    print("Generating back...")
    create_variant_c_back(config, str(output_dir / "herdshare-card-c-back.pdf"), str(qr_path))
    print("  ✓ herdshare-card-c-back.pdf")

    print("\n✅ All business cards generated successfully!")
    print(f"\nOutput directory: {output_dir.absolute()}")
    print("\nPrint-ready PDF files created:")
    print("  • Variant A: herdshare-card-a-front.pdf + herdshare-card-a-back.pdf")
    print("  • Variant B: herdshare-card-b-front.pdf + herdshare-card-b-back.pdf")
    print("  • Variant C: herdshare-card-c-front.pdf + herdshare-card-c-back.pdf")
    print("\nNext steps:")
    print("  1. Check output/*.pdf files")
    print("  2. Upload PDFs to printer (Vistaprint, Moo, etc.)")
    print("  3. Edit config.json for different contact info")
    print("  4. Replace placeholder logo with actual HerdShare logo\n")

if __name__ == "__main__":
    main()
