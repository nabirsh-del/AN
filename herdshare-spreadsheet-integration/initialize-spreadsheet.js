/**
 * Initialize Google Sheets with proper headers and formatting
 *
 * Run this script once to set up your spreadsheet:
 * node initialize-spreadsheet.js
 */

const https = require('https');
const crypto = require('crypto');

// Configuration - Update these values
const CONFIG = {
  serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 'your-service-account@project.iam.gserviceaccount.com',
  privateKey: process.env.GOOGLE_PRIVATE_KEY || '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n',
  spreadsheetId: process.env.SPREADSHEET_ID || 'your-spreadsheet-id'
};

// Orders sheet headers
const ORDERS_HEADERS = [
  'Order ID',
  'Stripe Payment ID',
  'Timestamp',
  'Status',
  'Buyer Name',
  'Organization Type',
  'Contact Email',
  'Contact Phone',
  'Delivery Address',
  'Product Type',
  'Estimated Weight (lbs)',
  'Price Paid',
  'Cost Basis',
  'Margin',
  'Margin %',
  'Requested Delivery Window',
  'Assigned Rancher',
  'Processing Facility',
  'Scheduled Processing Date',
  'Scheduled Ship Date',
  'Tracking Number',
  'Notes',
  'Last Updated'
];

// Accounting sheet headers
const ACCOUNTING_HEADERS = [
  'Order ID',
  'Order Date',
  'Month',
  'Product Type',
  'Revenue',
  'Rancher Cost',
  'Processing Cost',
  'Shipping Cost',
  'Total COGS',
  'Gross Margin',
  'Margin %',
  'Payment Status',
  'Rancher Paid',
  'Rancher Payment Date',
  'Stripe Fee',
  'Net Profit',
  'Net Margin %'
];

// Generate JWT for Google API
function generateJWT(email, privateKey) {
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');

  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const payload = Buffer.from(JSON.stringify(claim)).toString('base64url');
  const unsignedToken = `${header}.${payload}`;

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(unsignedToken);
  const signature = sign.sign(privateKey, 'base64url');

  return `${unsignedToken}.${signature}`;
}

// Get access token
async function getAccessToken() {
  const jwt = generateJWT(CONFIG.serviceAccountEmail, CONFIG.privateKey);

  return new Promise((resolve, reject) => {
    const postData = `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`;

    const options = {
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const response = JSON.parse(data);
        resolve(response.access_token);
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Update spreadsheet with headers
async function updateSpreadsheet(accessToken, sheetName, headers) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      values: [headers]
    });

    const options = {
      hostname: 'sheets.googleapis.com',
      path: `/v4/spreadsheets/${CONFIG.spreadsheetId}/values/${sheetName}!A1:append?valueInputOption=RAW`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        console.log(`✓ ${sheetName} headers set successfully`);
        resolve(JSON.parse(responseData));
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Format headers (bold, freeze row)
async function formatHeaders(accessToken, sheetId) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      requests: [
        {
          repeatCell: {
            range: {
              sheetId: sheetId,
              startRowIndex: 0,
              endRowIndex: 1
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.173, green: 0.373, blue: 0.176 },
                textFormat: {
                  foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 },
                  fontSize: 11,
                  bold: true
                }
              }
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat)'
          }
        },
        {
          updateSheetProperties: {
            properties: {
              sheetId: sheetId,
              gridProperties: {
                frozenRowCount: 1
              }
            },
            fields: 'gridProperties.frozenRowCount'
          }
        }
      ]
    });

    const options = {
      hostname: 'sheets.googleapis.com',
      path: `/v4/spreadsheets/${CONFIG.spreadsheetId}:batchUpdate`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        console.log('✓ Headers formatted successfully');
        resolve(JSON.parse(responseData));
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Main initialization
async function initialize() {
  console.log('🚀 Initializing HerdShare Spreadsheet...\n');

  try {
    // Get access token
    console.log('⏳ Getting access token...');
    const accessToken = await getAccessToken();
    console.log('✓ Access token obtained\n');

    // Set up ORDERS sheet
    console.log('⏳ Setting up ORDERS sheet...');
    await updateSpreadsheet(accessToken, 'ORDERS', ORDERS_HEADERS);

    // Set up ACCOUNTING sheet
    console.log('⏳ Setting up ACCOUNTING sheet...');
    await updateSpreadsheet(accessToken, 'ACCOUNTING', ACCOUNTING_HEADERS);

    // Format both sheets (sheet IDs typically 0 and 1)
    console.log('\n⏳ Formatting sheets...');
    await formatHeaders(accessToken, 0); // ORDERS
    await formatHeaders(accessToken, 1); // ACCOUNTING

    console.log('\n✅ Spreadsheet initialization complete!');
    console.log('\nNext steps:');
    console.log('1. Verify the spreadsheet at:');
    console.log(`   https://docs.google.com/spreadsheets/d/${CONFIG.spreadsheetId}/edit`);
    console.log('2. Deploy the Cloudflare Worker: npm run deploy');
    console.log('3. Set up Stripe webhook to point to your worker URL');

  } catch (error) {
    console.error('❌ Error initializing spreadsheet:', error.message);
    process.exit(1);
  }
}

// Run initialization
initialize();
