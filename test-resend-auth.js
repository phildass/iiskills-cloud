#!/usr/bin/env node

/**
 * Resend Domain Authentication Test Script
 * 
 * This script helps verify that:
 * 1. DNS records are properly configured
 * 2. Domain is verified in Resend
 * 3. Email sending works with authenticated domain
 * 
 * Usage:
 *   node test-resend-auth.js <test-email-address>
 * 
 * Example:
 *   node test-resend-auth.js admin@iiskills.cloud
 * 
 * Note: Ensure .env.local file exists with required variables or set them via environment
 */

// Configuration constants
const DOMAIN_CONFIG = {
  PRIMARY_DOMAIN: 'iiskills.cloud',
  SEND_SUBDOMAIN: 'send.iiskills.cloud',
  DKIM_DOMAIN: 'resend._domainkey.iiskills.cloud',
  DMARC_DOMAIN: '_dmarc.iiskills.cloud'
};

const MAX_DISPLAY_LENGTH = 100;
const ENV_PLACEHOLDER_PREFIX = 'your-';

// Helper function to truncate long strings
function truncateString(str, maxLength = MAX_DISPLAY_LENGTH) {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}

// Helper function to generate placeholder value for env var
function getEnvPlaceholder(varName) {
  return `${ENV_PLACEHOLDER_PREFIX}${varName.toLowerCase().replace(/_/g, '-')}-here`;
}

// Try to load .env.local if dotenv is available
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv not available, use process.env directly
  console.log('ℹ️  Loading environment variables from system (dotenv not installed)');
}

const testEmailAddress = process.argv[2];

if (!testEmailAddress) {
  console.error('❌ Error: Please provide a test email address');
  console.error('Usage: node test-resend-auth.js <email>');
  console.error('Example: node test-resend-auth.js admin@iiskills.cloud');
  process.exit(1);
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(testEmailAddress)) {
  console.error('❌ Error: Invalid email address format');
  process.exit(1);
}

console.log('\n🔍 Resend Domain Authentication Test\n');
console.log('=' .repeat(60));

// Step 1: Check environment variables
console.log('\n📋 Step 1: Checking Environment Configuration...\n');

const config = {
  apiKey: process.env.RESEND_API_KEY,
  senderEmail: process.env.SENDER_EMAIL,
  senderName: process.env.SENDER_NAME,
  provider: process.env.EMAIL_PROVIDER
};

const checks = [
  {
    name: 'EMAIL_PROVIDER',
    value: config.provider,
    expected: 'resend',
    required: true
  },
  {
    name: 'RESEND_API_KEY',
    value: config.apiKey,
    expected: 'Should start with "re_"',
    required: true
  },
  {
    name: 'SENDER_EMAIL',
    value: config.senderEmail,
    expected: 'Should use send.iiskills.cloud or iiskills.cloud',
    required: true
  },
  {
    name: 'SENDER_NAME',
    value: config.senderName,
    expected: 'Any friendly name',
    required: false
  }
];

let configValid = true;

checks.forEach(check => {
  const placeholder = getEnvPlaceholder(check.name);
  const status = check.value && check.value !== placeholder ? '✅' : '❌';
  const hasValue = check.value && check.value !== placeholder;
  
  console.log(`${status} ${check.name}: ${hasValue ? '✓ Set' : '✗ Not set'}`);
  
  if (check.required && !hasValue) {
    configValid = false;
  }
  
  if (hasValue && check.value) {
    if (check.name === 'RESEND_API_KEY') {
      const masked = check.value.substring(0, 8) + '...' + check.value.substring(check.value.length - 4);
      console.log(`   Value: ${masked}`);
      
      if (!check.value.startsWith('re_')) {
        console.log('   ⚠️  Warning: API key should start with "re_"');
        configValid = false;
      }
    } else {
      console.log(`   Value: ${check.value}`);
    }
    
    if (check.name === 'SENDER_EMAIL') {
      const domain = check.value.split('@')[1];
      if (!domain?.includes('iiskills.cloud')) {
        console.log('   ⚠️  Warning: Sender email should use iiskills.cloud domain');
      }
      if (domain === 'iiskills.cloud') {
        console.log('   ℹ️  Using root domain - ensure it\'s verified in Resend');
      } else if (domain === 'send.iiskills.cloud') {
        console.log('   ✓ Using send subdomain (recommended)');
      }
    }
  }
});

if (!configValid) {
  console.log('\n❌ Configuration incomplete. Please update .env.local');
  console.log('   See RESEND_DOMAIN_SETUP.md for instructions');
  process.exit(1);
}

console.log('\n✅ Environment configuration looks good!\n');

// Step 2: Check DNS records
console.log('📋 Step 2: Checking DNS Records...\n');

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function checkDNS() {
  const dnsChecks = [
    {
      name: 'DKIM Record',
      domain: DOMAIN_CONFIG.DKIM_DOMAIN,
      type: 'TXT',
      expected: 'Should contain DKIM key'
    },
    {
      name: 'SPF Record',
      domain: DOMAIN_CONFIG.SEND_SUBDOMAIN,
      type: 'TXT',
      expected: 'Should contain "v=spf1 include:amazonses.com"'
    },
    {
      name: 'MX Record',
      domain: DOMAIN_CONFIG.SEND_SUBDOMAIN,
      type: 'MX',
      expected: 'Should point to feedback-smtp.ap-northeast-1.amazonses.com'
    },
    {
      name: 'DMARC Record',
      domain: DOMAIN_CONFIG.DMARC_DOMAIN,
      type: 'TXT',
      expected: 'Should contain "v=DMARC1"'
    }
  ];

  for (const check of dnsChecks) {
    try {
      // Using fixed domain config to prevent any injection
      const command = `dig ${check.domain} ${check.type} +short`;
      const { stdout, stderr } = await execPromise(command);
      const result = stdout.trim();
      
      if (result && result.length > 0) {
        console.log(`✅ ${check.name}: Found`);
        console.log(`   ${truncateString(result)}`);
      } else {
        console.log(`❌ ${check.name}: Not found`);
        console.log(`   ${check.expected}`);
        console.log(`   ℹ️  This may take up to 48 hours to propagate`);
      }
    } catch (error) {
      console.log(`⚠️  ${check.name}: Unable to check (dig command not available)`);
      console.log(`   Use online tools: https://dnschecker.org`);
    }
  }
}

// Step 3: Send test email
async function sendTestEmail() {
  console.log('\n📋 Step 3: Sending Test Email...\n');
  
  try {
    const { Resend } = require('resend');
    const resend = new Resend(config.apiKey);

    const emailData = {
      from: `${config.senderName || 'iiskills.cloud'} <${config.senderEmail}>`,
      to: testEmailAddress,
      subject: '🔐 Domain Authentication Test - iiskills.cloud',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">🔐 Domain Authentication Test</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #667eea;">Success! ✅</h2>
              
              <p>This email confirms that your Resend domain authentication is working correctly!</p>
              
              <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
                <h3 style="margin-top: 0; color: #667eea;">What This Means:</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  <li>✅ DNS records are properly configured</li>
                  <li>✅ Domain verification is complete</li>
                  <li>✅ Email sending is authenticated</li>
                  <li>✅ Your emails will have better deliverability</li>
                </ul>
              </div>
              
              <h3 style="color: #667eea;">Email Authentication Details:</h3>
              <table style="width: 100%; background: white; border-radius: 5px; padding: 15px;">
                <tr>
                  <td style="padding: 8px; font-weight: bold;">From Domain:</td>
                  <td style="padding: 8px;">${config.senderEmail?.split('@')[1]}</td>
                </tr>
                <tr style="background: #f5f5f5;">
                  <td style="padding: 8px; font-weight: bold;">Sender Email:</td>
                  <td style="padding: 8px;">${config.senderEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold;">Provider:</td>
                  <td style="padding: 8px;">Resend (via Amazon SES)</td>
                </tr>
              </table>
              
              <div style="margin-top: 30px; padding: 15px; background: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">
                <h4 style="margin-top: 0; color: #856404;">📧 Check Email Headers</h4>
                <p style="margin-bottom: 0; font-size: 14px;">
                  View the email headers to verify authentication results. You should see:
                  <br><br>
                  <code style="background: white; padding: 10px; display: block; border-radius: 3px; font-size: 12px;">
                    dkim=pass<br>
                    spf=pass<br>
                    dmarc=pass
                  </code>
                </p>
              </div>
              
              <div style="margin-top: 20px; padding: 15px; background: #d1ecf1; border-radius: 5px; border-left: 4px solid #0c5460;">
                <h4 style="margin-top: 0; color: #0c5460;">📖 Next Steps</h4>
                <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
                  <li>Monitor email deliverability in Resend dashboard</li>
                  <li>Start sending newsletters to subscribers</li>
                  <li>Review DMARC reports for authentication status</li>
                  <li>Consider upgrading DMARC policy from "none" to "quarantine"</li>
                </ul>
              </div>
              
              <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
                Sent by iiskills.cloud Newsletter System<br>
                Powered by Resend Email Delivery
              </p>
            </div>
          </body>
        </html>
      `,
      tags: [
        { name: 'test', value: 'domain-authentication' },
        { name: 'environment', value: 'verification' }
      ]
    };

    console.log(`📧 Sending to: ${testEmailAddress}`);
    console.log(`📤 From: ${emailData.from}`);
    
    const result = await resend.emails.send(emailData);
    
    console.log('\n✅ Email sent successfully!\n');
    console.log('📬 Email Details:');
    console.log(`   ID: ${result.id}`);
    console.log(`   To: ${testEmailAddress}`);
    console.log(`   From: ${emailData.from}`);
    
    console.log('\n✅ Next Steps:');
    console.log('   1. Check your inbox for the test email');
    console.log('   2. If not in inbox, check spam/junk folder');
    console.log('   3. View email headers to verify DKIM/SPF/DMARC pass');
    console.log('   4. Monitor delivery in Resend dashboard');
    
    console.log('\n📊 Resend Dashboard:');
    console.log('   https://resend.com/emails');
    
    return true;
  } catch (error) {
    console.log('\n❌ Error sending email:\n');
    
    if (error.message?.includes('API key')) {
      console.log('   Problem: Invalid API key');
      console.log('   Solution: Check your RESEND_API_KEY in .env.local');
      console.log('   Get API key: https://resend.com/api-keys');
    } else if (error.message?.includes('domain')) {
      console.log('   Problem: Domain not verified');
      console.log('   Solution: Add DNS records and wait for verification');
      console.log('   Guide: See RESEND_DOMAIN_SETUP.md');
    } else if (error.message?.includes('from')) {
      console.log('   Problem: Invalid sender email');
      console.log('   Solution: Use verified domain in SENDER_EMAIL');
      console.log('   Example: newsletter@send.iiskills.cloud');
    } else {
      console.log(`   ${error.message}`);
    }
    
    console.log('\n📖 Troubleshooting:');
    console.log('   See RESEND_DOMAIN_SETUP.md for detailed instructions');
    
    return false;
  }
}

// Run all checks
async function runTests() {
  try {
    // Check if dig is available for DNS checks
    try {
      await execPromise('which dig');
      await checkDNS();
    } catch {
      console.log('⚠️  DNS checking skipped (dig not available)');
      console.log('   Use online tools to verify DNS: https://dnschecker.org\n');
    }
    
    // Send test email
    const success = await sendTestEmail();
    
    console.log('\n' + '='.repeat(60));
    
    if (success) {
      console.log('\n🎉 Domain authentication test completed successfully!\n');
      process.exit(0);
    } else {
      console.log('\n⚠️  Some issues were found. Please review above.\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

runTests();
