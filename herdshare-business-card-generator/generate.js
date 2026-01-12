#!/usr/bin/env node

/**
 * HerdShare Business Card Generator
 *
 * Generates print-ready PDFs and PNG previews from HTML templates
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const QRCode = require('qrcode');

// Paths
const CONFIG_PATH = './config.json';
const TEMPLATES_DIR = './templates';
const OUTPUT_DIR = './output';
const ASSETS_DIR = './assets';

// Card specifications (at 300 DPI)
const CARD_SPECS = {
    width: 1125,  // 3.75" including bleed
    height: 675,  // 2.25" including bleed
    dpi: 300
};

/**
 * Load configuration
 */
function loadConfig() {
    try {
        const configData = fs.readFileSync(CONFIG_PATH, 'utf8');
        return JSON.parse(configData);
    } catch (error) {
        console.error('Error loading config.json:', error.message);
        process.exit(1);
    }
}

/**
 * Generate QR code as data URL
 */
async function generateQRCode(url) {
    try {
        const qrDataUrl = await QRCode.toDataURL(url, {
            width: 225,
            margin: 1,
            color: {
                dark: '#2c5f2d',
                light: '#ffffff'
            }
        });
        return qrDataUrl;
    } catch (error) {
        console.error('Error generating QR code:', error.message);
        return null;
    }
}

/**
 * Replace template placeholders with actual values
 */
function fillTemplate(html, config, qrCodeDataUrl = null) {
    let filled = html;

    // Replace config values
    Object.keys(config).forEach(key => {
        if (typeof config[key] === 'string') {
            const regex = new RegExp(`{{${key}}}`, 'g');
            filled = filled.replace(regex, config[key]);
        }
    });

    // Replace color values
    if (config.colors) {
        Object.keys(config.colors).forEach(colorKey => {
            const regex = new RegExp(`{{${colorKey}}}`, 'g');
            filled = filled.replace(regex, config.colors[colorKey]);
        });
    }

    // Replace QR code if available
    if (qrCodeDataUrl) {
        filled = filled.replace(
            /<div class="qr-code">[\s\S]*?<\/div>/,
            `<div class="qr-code"><img src="${qrCodeDataUrl}" alt="QR Code"></div>`
        );
    }

    return filled;
}

/**
 * Generate PDF and PNG from HTML template
 */
async function generateCard(browser, templatePath, outputName, config, qrCodeDataUrl = null) {
    console.log(`Generating ${outputName}...`);

    try {
        // Read template
        const templateHtml = fs.readFileSync(templatePath, 'utf8');
        const filledHtml = fillTemplate(templateHtml, config, qrCodeDataUrl);

        // Create a new page
        const page = await browser.newPage();
        await page.setViewportSize({
            width: CARD_SPECS.width,
            height: CARD_SPECS.height
        });

        // Set content
        await page.setContent(filledHtml, { waitUntil: 'networkidle' });

        // Generate PDF
        const pdfPath = path.join(OUTPUT_DIR, `${outputName}.pdf`);
        await page.pdf({
            path: pdfPath,
            width: `${CARD_SPECS.width}px`,
            height: `${CARD_SPECS.height}px`,
            printBackground: true,
            preferCSSPageSize: true
        });

        console.log(`  ✓ PDF: ${pdfPath}`);

        // Generate PNG
        const pngPath = path.join(OUTPUT_DIR, `${outputName}.png`);
        await page.screenshot({
            path: pngPath,
            fullPage: true,
            omitBackground: false
        });

        console.log(`  ✓ PNG: ${pngPath}`);

        await page.close();

        return { pdf: pdfPath, png: pngPath };

    } catch (error) {
        console.error(`Error generating ${outputName}:`, error.message);
        return null;
    }
}

/**
 * Main generation function
 */
async function main() {
    console.log('🐄 HerdShare Business Card Generator\n');

    // Load configuration
    console.log('Loading configuration...');
    const config = loadConfig();
    console.log(`  Name: ${config.name}`);
    console.log(`  Title: ${config.title}`);
    console.log(`  Email: ${config.email}\n`);

    // Create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Generate QR code
    console.log('Generating QR code...');
    const qrCodeDataUrl = await generateQRCode(config.qr_url);
    if (qrCodeDataUrl) {
        console.log('  ✓ QR code generated\n');
    }

    // Launch browser
    console.log('Starting browser...\n');
    const browser = await chromium.launch({ headless: true });

    // Define variants
    const variants = [
        {
            name: 'Variant A (Minimal)',
            front: 'variant-a-front.html',
            back: 'variant-a-back.html',
            prefix: 'herdshare-card-a'
        },
        {
            name: 'Variant B (Textured)',
            front: 'variant-b-front.html',
            back: 'variant-a-back.html', // Same back as A
            prefix: 'herdshare-card-b'
        },
        {
            name: 'Variant C (Dark)',
            front: 'variant-c-front.html',
            back: 'variant-c-back.html',
            prefix: 'herdshare-card-c'
        }
    ];

    // Generate each variant
    for (const variant of variants) {
        console.log(`\n=== ${variant.name} ===`);

        // Front
        await generateCard(
            browser,
            path.join(TEMPLATES_DIR, variant.front),
            `${variant.prefix}-front`,
            config
        );

        // Back
        await generateCard(
            browser,
            path.join(TEMPLATES_DIR, variant.back),
            `${variant.prefix}-back`,
            config,
            qrCodeDataUrl
        );
    }

    await browser.close();

    console.log('\n✅ All business cards generated successfully!');
    console.log(`\nOutput directory: ${path.resolve(OUTPUT_DIR)}`);
    console.log('\nFiles created:');
    console.log('  • herdshare-card-a-front.pdf/png (Minimal - White)');
    console.log('  • herdshare-card-a-back.pdf/png');
    console.log('  • herdshare-card-b-front.pdf/png (Textured)');
    console.log('  • herdshare-card-b-back.pdf/png');
    console.log('  • herdshare-card-c-front.pdf/png (Dark - Green)');
    console.log('  • herdshare-card-c-back.pdf/png');
    console.log('\nNext steps:');
    console.log('  1. Review PNG previews in /output folder');
    console.log('  2. Upload PDFs to your printer (Vistaprint, Moo, etc.)');
    console.log('  3. Edit config.json to change contact info');
    console.log('  4. Replace assets/herdshare-logo.svg with your actual logo\n');
}

// Run generator
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
