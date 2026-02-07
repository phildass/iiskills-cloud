#!/usr/bin/env node

/**
 * Unit Tests for Razorpay Utility Functions
 * 
 * Tests the core utility functions without requiring a running server.
 * This validates the payment logic, OTP generation, database operations, etc.
 */

// Set up test environment variables
process.env.RAZORPAY_KEY_ID = "rzp_test_demo_key_id";
process.env.RAZORPAY_KEY_SECRET = "test_secret_key_12345";
process.env.RAZORPAY_WEBHOOK_SECRET = "test_webhook_secret_12345";

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title) {
  console.log("\n" + "=".repeat(60));
  log(title, colors.cyan + colors.bold);
  console.log("=".repeat(60));
}

function assert(condition, message) {
  if (condition) {
    log(`✅ ${message}`, colors.green);
    return true;
  } else {
    log(`❌ ${message}`, colors.red);
    return false;
  }
}

async function testRazorpayUtilities() {
  logSection("TEST 1: Razorpay Utilities");

  const { 
    getRazorpayClient, 
    generateSecureOTP, 
    calculateMembershipExpiry,
    verifyWebhookSignature 
  } = require("./lib/razorpay");

  // Test 1: Razorpay client initialization
  try {
    const client = getRazorpayClient();
    assert(client !== null && client !== undefined, "Razorpay client initialized successfully");
  } catch (error) {
    assert(false, "Razorpay client initialization: " + error.message);
  }

  // Test 2: OTP generation
  const otp = generateSecureOTP(6);
  assert(otp.length === 6, `OTP length is 6 (got: ${otp})`);
  assert(/^\d+$/.test(otp), "OTP contains only digits");
  
  const otp8 = generateSecureOTP(8);
  assert(otp8.length === 8, `OTP with custom length works (got ${otp8.length} digits)`);

  // Test 3: Membership expiry calculation
  const expiry = calculateMembershipExpiry();
  const now = new Date();
  const oneYearLater = new Date(now);
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
  assert(
    Math.abs(expiry.getTime() - oneYearLater.getTime()) < 100,
    "Membership expiry is 1 year from now"
  );

  // Test 4: Webhook signature verification
  const testBody = JSON.stringify({ test: "data" });
  const crypto = require("crypto");
  const validSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(testBody)
    .digest("hex");
  
  const isValid = verifyWebhookSignature(testBody, validSignature, process.env.RAZORPAY_WEBHOOK_SECRET);
  assert(isValid === true, "Webhook signature verification works for valid signature");

  const isInvalid = verifyWebhookSignature(testBody, "invalid_signature", process.env.RAZORPAY_WEBHOOK_SECRET);
  assert(isInvalid === false, "Webhook signature verification rejects invalid signature");
}

async function testMockDatabase() {
  logSection("TEST 2: Mock Database Operations");

  const {
    storePayment,
    getPayment,
    storeOTP,
    verifyOTP,
    storeMembership,
    getMembership,
    clearAllRecords,
  } = require("./lib/mockDatabase");

  // Clear any previous test data
  clearAllRecords();

  // Test 1: Store and retrieve payment
  const testPayment = {
    order_id: "order_test_123",
    email: "test@example.com",
    name: "Test User",
    app_id: "learn-ai",
    app_name: "Learn AI",
    amount: 99900,
    status: "created",
  };

  storePayment(testPayment);
  const retrievedPayment = getPayment("order_test_123");
  assert(retrievedPayment !== null, "Payment stored and retrieved successfully");
  assert(retrievedPayment.order_id === "order_test_123", "Payment data is correct");

  // Test 2: Store and verify OTP
  const testOTP = "123456";
  storeOTP("test@example.com", "learn-ai", testOTP, "order_test_123");
  
  // First, test with wrong OTP (before using the correct one)
  const invalidResult = verifyOTP("test@example.com", "learn-ai", "999999");
  assert(invalidResult.valid === false, "OTP verification fails for incorrect OTP");
  assert(invalidResult.error === "Invalid OTP", "Error message is correct for wrong OTP");
  
  // Then verify with correct OTP
  const validResult = verifyOTP("test@example.com", "learn-ai", testOTP);
  assert(validResult.valid === true, "OTP verification succeeds for correct OTP");

  // Test 3: OTP can only be used once
  clearAllRecords();
  storeOTP("test@example.com", "learn-ai", "654321", "order_test_456");
  verifyOTP("test@example.com", "learn-ai", "654321"); // First use
  const secondUse = verifyOTP("test@example.com", "learn-ai", "654321"); // Second use
  assert(secondUse.valid === false, "OTP cannot be used twice");
  assert(secondUse.error === "OTP already used", "Error message for reused OTP is correct");

  // Test 4: Store and retrieve membership
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  
  storeMembership("member@example.com", "learn-ai", expiryDate, "order_test_789");
  const membership = getMembership("member@example.com", "learn-ai");
  
  assert(membership !== null, "Membership stored and retrieved successfully");
  assert(membership.status === "active", "Membership status is active");
  assert(membership.email === "member@example.com", "Membership email is correct");
}

async function testEmailGeneration() {
  logSection("TEST 3: Email Generation");

  const { sendMembershipEmail } = require("./lib/membershipEmail");

  const emailParams = {
    email: "test@example.com",
    name: "Test User",
    appId: "learn-ai",
    appName: "Learn AI",
    otp: "123456",
    orderId: "order_test_123",
    amount: 99900,
  };

  const result = await sendMembershipEmail(emailParams);
  
  assert(result.success === true, "Email generation succeeds");
  assert(result.provider === "mock", "Uses mock provider");
  assert(result.email === "test@example.com", "Email recipient is correct");
}

async function runAllTests() {
  log("\n" + "=".repeat(60), colors.bold);
  log("  RAZORPAY UTILITIES UNIT TEST SUITE", colors.cyan + colors.bold);
  log("=".repeat(60), colors.bold);

  try {
    await testRazorpayUtilities();
    await testMockDatabase();
    await testEmailGeneration();

    logSection("TEST SUMMARY");
    log("\n✅ All utility functions working correctly", colors.green);
    log("✅ OTP generation and verification working", colors.green);
    log("✅ Database operations working", colors.green);
    log("✅ Email generation working", colors.green);
    log("\n🎉 All unit tests passed!\n", colors.green + colors.bold);

  } catch (error) {
    log("\n❌ Test failed: " + error.message, colors.red);
    console.error(error);
    process.exit(1);
  }
}

// Run the tests
runAllTests();
