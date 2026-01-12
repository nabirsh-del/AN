/**
 * HerdShare Spreadsheet Integration - Cloudflare Worker
 *
 * Handles:
 * - Stripe webhook for new orders
 * - Google Sheets API integration
 * - Admin dashboard API endpoints
 */

import Stripe from 'stripe';

// Helper: Generate JWT for Google Sheets API
async function generateGoogleJWT(serviceAccountEmail, privateKey) {
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: serviceAccountEmail,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedClaim = base64urlEncode(JSON.stringify(claim));
  const unsignedToken = `${encodedHeader}.${encodedClaim}`;

  const key = await crypto.subtle.importKey(
    'pkcs8',
    str2ab(privateKey.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g, '')),
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256'
    },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(unsignedToken)
  );

  const encodedSignature = base64urlEncode(signature);
  return `${unsignedToken}.${encodedSignature}`;
}

function base64urlEncode(data) {
  if (typeof data === 'string') {
    data = new TextEncoder().encode(data);
  }
  const base64 = btoa(String.fromCharCode(...new Uint8Array(data)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function str2ab(str) {
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Get Google Sheets access token
async function getGoogleAccessToken(serviceAccountEmail, privateKey) {
  const jwt = await generateGoogleJWT(serviceAccountEmail, privateKey);

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });

  const data = await response.json();
  return data.access_token;
}

// Write order to Google Sheets
async function writeOrderToSheets(accessToken, spreadsheetId, orderData) {
  const orderId = generateOrderId();
  const timestamp = new Date().toISOString();

  // Prepare ORDERS sheet row
  const ordersRow = [
    orderId,
    orderData.stripePaymentId,
    timestamp,
    'Pending', // Status
    orderData.buyerName,
    orderData.organizationType || 'Fraternity',
    orderData.email,
    orderData.phone,
    orderData.deliveryAddress,
    orderData.productType,
    orderData.estimatedWeight,
    orderData.pricePaid,
    orderData.costBasis,
    orderData.margin,
    orderData.marginPercent,
    orderData.deliveryWindow || '',
    '', // Assigned Rancher
    '', // Processing Facility
    '', // Scheduled Processing Date
    '', // Scheduled Ship Date
    '', // Tracking Number
    orderData.notes || '',
    timestamp // Last Updated
  ];

  // Prepare ACCOUNTING sheet row
  const accountingRow = [
    orderId,
    new Date().toLocaleDateString('en-US'),
    new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    orderData.productType,
    orderData.pricePaid,
    orderData.rancherCost,
    orderData.processingCost,
    orderData.shippingCost,
    orderData.totalCOGS,
    orderData.grossMargin,
    orderData.marginPercent,
    'Paid',
    'No', // Rancher Paid
    '', // Rancher Payment Date
    orderData.stripeFee,
    orderData.netProfit,
    orderData.netMarginPercent
  ];

  // Append to ORDERS sheet
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/ORDERS!A:W:append?valueInputOption=RAW`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [ordersRow]
      })
    }
  );

  // Append to ACCOUNTING sheet
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/ACCOUNTING!A:Q:append?valueInputOption=RAW`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [accountingRow]
      })
    }
  );

  return orderId;
}

// Generate order ID
function generateOrderId() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `HS-${year}-${randomNum}`;
}

// Calculate order financials
function calculateOrderFinancials(productType, pricePaid) {
  const pricing = {
    'Whole': { weight: 475, rancherCost: 2800, processing: 500, shipping: 200 },
    'Half': { weight: 237, rancherCost: 1400, processing: 300, shipping: 150 },
    'Quarter': { weight: 118, rancherCost: 700, processing: 200, shipping: 100 }
  };

  const config = pricing[productType];
  const totalCOGS = config.rancherCost + config.processing + config.shipping;
  const grossMargin = pricePaid - totalCOGS;
  const marginPercent = ((grossMargin / pricePaid) * 100).toFixed(1);
  const stripeFee = (pricePaid * 0.029 + 0.30).toFixed(2);
  const netProfit = (grossMargin - parseFloat(stripeFee)).toFixed(2);
  const netMarginPercent = ((netProfit / pricePaid) * 100).toFixed(1);

  return {
    estimatedWeight: config.weight,
    costBasis: totalCOGS,
    rancherCost: config.rancherCost,
    processingCost: config.processing,
    shippingCost: config.shipping,
    totalCOGS: totalCOGS,
    margin: grossMargin,
    grossMargin: grossMargin,
    marginPercent: marginPercent,
    stripeFee: parseFloat(stripeFee),
    netProfit: parseFloat(netProfit),
    netMarginPercent: netMarginPercent
  };
}

// Read orders from Google Sheets
async function getOrders(accessToken, spreadsheetId) {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/ORDERS!A2:W`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );

  const data = await response.json();
  return data.values || [];
}

// Read accounting data from Google Sheets
async function getAccounting(accessToken, spreadsheetId) {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/ACCOUNTING!A2:Q`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );

  const data = await response.json();
  return data.values || [];
}

// Update order status
async function updateOrderStatus(accessToken, spreadsheetId, orderId, newStatus, updates = {}) {
  // First, find the row number for this order
  const orders = await getOrders(accessToken, spreadsheetId);
  const rowIndex = orders.findIndex(row => row[0] === orderId);

  if (rowIndex === -1) {
    throw new Error('Order not found');
  }

  const rowNumber = rowIndex + 2; // +2 because: +1 for header, +1 for 0-index

  // Update status (column D)
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/ORDERS!D${rowNumber}?valueInputOption=RAW`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [[newStatus]]
      })
    }
  );

  // Update other fields if provided
  if (updates.trackingNumber) {
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/ORDERS!U${rowNumber}?valueInputOption=RAW`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: [[updates.trackingNumber]]
        })
      }
    );
  }

  // Update last updated timestamp (column W)
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/ORDERS!W${rowNumber}?valueInputOption=RAW`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [[new Date().toISOString()]]
      })
    }
  );
}

// Main request handler
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS headers for admin dashboard
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Stripe webhook endpoint
      if (url.pathname === '/stripe-webhook' && request.method === 'POST') {
        const stripe = new Stripe(env.STRIPE_SECRET_KEY);
        const signature = request.headers.get('stripe-signature');
        const body = await request.text();

        // Verify webhook signature
        let event;
        try {
          event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
          return new Response(JSON.stringify({ error: 'Invalid signature' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Handle checkout.session.completed
        if (event.type === 'checkout.session.completed') {
          const session = event.data.object;

          // Extract order data from session
          const orderData = {
            stripePaymentId: session.payment_intent,
            buyerName: session.metadata.buyerName,
            organizationType: session.metadata.organizationType,
            email: session.customer_details.email,
            phone: session.customer_details.phone,
            deliveryAddress: session.metadata.deliveryAddress,
            productType: session.metadata.productType,
            pricePaid: session.amount_total / 100, // Convert from cents
            deliveryWindow: session.metadata.deliveryWindow,
            notes: session.metadata.notes
          };

          // Calculate financials
          const financials = calculateOrderFinancials(orderData.productType, orderData.pricePaid);
          Object.assign(orderData, financials);

          // Write to Google Sheets
          const accessToken = await getGoogleAccessToken(
            env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            env.GOOGLE_PRIVATE_KEY
          );

          const orderId = await writeOrderToSheets(
            accessToken,
            env.SPREADSHEET_ID,
            orderData
          );

          return new Response(JSON.stringify({ success: true, orderId }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Admin API: Get orders
      if (url.pathname === '/api/orders' && request.method === 'GET') {
        const accessToken = await getGoogleAccessToken(
          env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          env.GOOGLE_PRIVATE_KEY
        );

        const orders = await getOrders(accessToken, env.SPREADSHEET_ID);

        return new Response(JSON.stringify({ orders }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Admin API: Get accounting data
      if (url.pathname === '/api/accounting' && request.method === 'GET') {
        const accessToken = await getGoogleAccessToken(
          env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          env.GOOGLE_PRIVATE_KEY
        );

        const accounting = await getAccounting(accessToken, env.SPREADSHEET_ID);

        return new Response(JSON.stringify({ accounting }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Admin API: Update order status
      if (url.pathname === '/api/orders/update' && request.method === 'POST') {
        const { orderId, status, updates } = await request.json();

        const accessToken = await getGoogleAccessToken(
          env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          env.GOOGLE_PRIVATE_KEY
        );

        await updateOrderStatus(accessToken, env.SPREADSHEET_ID, orderId, status, updates);

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Health check
      if (url.pathname === '/health') {
        return new Response(JSON.stringify({ status: 'ok' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response('Not Found', { status: 404 });

    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
