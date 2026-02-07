/**
 * Payment Initiation Endpoint
 * 
 * POST /api/pay
 * 
 * Creates a Razorpay order and returns order details for payment processing.
 * This is demo/test logic - integrates with Razorpay test mode.
 * 
 * Security:
 * - All operations are server-side only
 * - Razorpay credentials are never exposed to client
 * - Amount validation and sanitization
 * 
 * Request Body:
 * {
 *   "email": "user@example.com",
 *   "name": "John Doe",
 *   "phone": "9876543210",
 *   "appId": "learn-ai",
 *   "appName": "Learn AI",
 *   "amount": 99900  // Amount in paise (₹999)
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "order": {
 *     "id": "order_xxx",
 *     "amount": 99900,
 *     "currency": "INR",
 *     ...
 *   },
 *   "key_id": "rzp_test_xxx",  // For client-side Razorpay checkout
 *   "user": { email, name, phone }
 * }
 */

import { getRazorpayClient } from "../../../lib/razorpay";
import { storePayment } from "../../../lib/mockDatabase";

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ 
      success: false, 
      error: "Method not allowed. Use POST." 
    });
  }

  try {
    // Extract and validate request body
    const { email, name, phone, appId, appName, amount } = req.body;

    // Validate required fields
    if (!email || !name || !appId || !appName || !amount) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: email, name, appId, appName, amount",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
    }

    // Validate amount (must be positive integer in paise)
    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid amount. Must be a positive integer in paise.",
      });
    }

    // Amount sanity check (max ₹1,00,000 = 10000000 paise)
    if (amount > 10000000) {
      return res.status(400).json({
        success: false,
        error: "Amount exceeds maximum allowed limit",
      });
    }

    // Initialize Razorpay client
    const razorpay = getRazorpayClient();

    // Create Razorpay order
    const orderOptions = {
      amount: amount, // Amount in paise
      currency: "INR",
      receipt: `receipt_${appId}_${Date.now()}`,
      notes: {
        email,
        name,
        phone: phone || "N/A",
        app_id: appId,
        app_name: appName,
        timestamp: new Date().toISOString(),
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    // Store payment record in mock database
    storePayment({
      order_id: order.id,
      email: email.toLowerCase(),
      name,
      phone: phone || null,
      app_id: appId,
      app_name: appName,
      amount,
      currency: order.currency,
      status: "created",
      receipt: order.receipt,
      notes: order.notes,
    });

    // Log for demo purposes
    console.log("\n========================================");
    console.log("💳 Payment Order Created");
    console.log("========================================");
    console.log("Order ID:", order.id);
    console.log("Amount: ₹", amount / 100);
    console.log("App:", appName);
    console.log("User:", email);
    console.log("========================================\n");

    // Return order details to client
    return res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
      key_id: process.env.RAZORPAY_KEY_ID, // Client needs this for checkout
      user: {
        email,
        name,
        phone: phone || null,
      },
      app: {
        id: appId,
        name: appName,
      },
    });

  } catch (error) {
    console.error("Payment initiation error:", error);

    // Handle specific Razorpay errors
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        error: error.error?.description || "Razorpay error occurred",
        code: error.error?.code,
      });
    }

    // Generic error response
    return res.status(500).json({
      success: false,
      error: "Failed to create payment order. Please try again.",
      message: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
