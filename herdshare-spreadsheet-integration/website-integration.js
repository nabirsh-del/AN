/**
 * HerdShare Website Integration - Stripe Checkout Handler
 *
 * Add this to your main HerdShare website to enable ordering.
 * This creates Stripe checkout sessions with metadata that the webhook worker will process.
 */

// CONFIGURATION - Update these with your actual values
const STRIPE_PUBLIC_KEY = 'pk_test_YOUR_STRIPE_PUBLIC_KEY'; // Get from Stripe Dashboard
const WORKER_URL = 'https://herdshare-integration.YOUR_SUBDOMAIN.workers.dev'; // Your deployed worker URL

// Pricing configuration
const PRODUCT_PRICING = {
  'Whole': {
    price: 475000, // $4,750.00 in cents
    weight: 475,
    name: 'Whole Cow',
    description: '~475 lbs of retail cuts'
  },
  'Half': {
    price: 237000, // $2,370.00 in cents
    weight: 237,
    name: 'Half Cow',
    description: '~237 lbs of retail cuts'
  },
  'Quarter': {
    price: 118000, // $1,180.00 in cents
    weight: 118,
    name: 'Quarter Cow',
    description: '~118 lbs of retail cuts'
  }
};

/**
 * Initialize Stripe
 */
const stripe = Stripe(STRIPE_PUBLIC_KEY);

/**
 * Create checkout session and redirect to Stripe
 *
 * @param {Object} orderData - Order information from form
 * @param {string} orderData.productType - "Whole", "Half", or "Quarter"
 * @param {string} orderData.buyerName - Name of buyer/organization
 * @param {string} orderData.organizationType - "Fraternity", "Institution", etc.
 * @param {string} orderData.email - Contact email
 * @param {string} orderData.phone - Contact phone
 * @param {string} orderData.deliveryAddress - Full delivery address
 * @param {string} orderData.deliveryWindow - Preferred delivery timeframe
 * @param {string} orderData.notes - Any special notes or requests
 */
async function createCheckoutSession(orderData) {
  try {
    // Validate required fields
    if (!orderData.productType || !orderData.buyerName || !orderData.email || !orderData.deliveryAddress) {
      throw new Error('Missing required order information');
    }

    // Get product pricing
    const product = PRODUCT_PRICING[orderData.productType];
    if (!product) {
      throw new Error('Invalid product type');
    }

    // Create Stripe checkout session
    const response = await fetch(`${WORKER_URL}/create-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productType: orderData.productType,
        price: product.price,
        productName: product.name,
        productDescription: product.description,
        buyerName: orderData.buyerName,
        organizationType: orderData.organizationType || 'Other',
        email: orderData.email,
        phone: orderData.phone || '',
        deliveryAddress: orderData.deliveryAddress,
        deliveryWindow: orderData.deliveryWindow || '',
        notes: orderData.notes || ''
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      throw error;
    }

  } catch (error) {
    console.error('Checkout error:', error);
    alert('Error creating checkout session. Please try again.');
  }
}

/**
 * Handle order form submission
 */
function handleOrderFormSubmit(event) {
  event.preventDefault();

  // Get form data
  const formData = new FormData(event.target);
  const orderData = {
    productType: formData.get('productType'),
    buyerName: formData.get('buyerName'),
    organizationType: formData.get('organizationType'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    deliveryAddress: formData.get('deliveryAddress'),
    deliveryWindow: formData.get('deliveryWindow'),
    notes: formData.get('notes')
  };

  // Create checkout session
  createCheckoutSession(orderData);
}

/**
 * Initialize order form
 */
document.addEventListener('DOMContentLoaded', function() {
  const orderForm = document.getElementById('herdshare-order-form');
  if (orderForm) {
    orderForm.addEventListener('submit', handleOrderFormSubmit);
  }
});

/**
 * Quick order button handler (for "Order Now" CTAs)
 */
function quickOrder(productType) {
  // Scroll to order form
  const orderForm = document.getElementById('herdshare-order-form');
  if (orderForm) {
    orderForm.scrollIntoView({ behavior: 'smooth' });
    // Pre-select product type
    const productSelect = orderForm.querySelector('[name="productType"]');
    if (productSelect) {
      productSelect.value = productType;
    }
  }
}
