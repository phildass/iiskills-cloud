#!/usr/bin/env node

/**
 * Custom Next.js Production Server for learn-apt
 * 
 * This custom server ensures reliable production startup with explicit
 * hostname and port binding. It addresses production deployment issues
 * where the default `next start` may not reliably bind to the network.
 * 
 * Features:
 * - Explicit binding to 0.0.0.0 (all interfaces) for nginx proxy compatibility
 * - Guaranteed PORT=3001 binding (with fallback from env)
 * - Graceful shutdown handling for PM2 compatibility
 * - Startup verification and logging
 * - Error handling for port conflicts
 * 
 * Usage:
 *   node server.js              # Uses PORT from env or defaults to 3001
 *   PORT=3001 node server.js    # Explicit port override
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Configuration
const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0'; // Bind to all interfaces for nginx proxy
const port = parseInt(process.env.PORT || '3001', 10);

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

/**
 * Start the server
 */
async function startServer() {
  try {
    console.log('🚀 Starting Next.js server...');
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Hostname: ${hostname}`);
    console.log(`   Port: ${port}`);
    
    // Prepare Next.js app
    await app.prepare();
    console.log('✅ Next.js app prepared');
    
    // Create HTTP server
    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error handling request:', err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });
    
    // Error handling
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Error: Port ${port} is already in use`);
        console.error('   Try one of the following:');
        console.error(`   1. Stop the process using port ${port}: lsof -ti:${port} | xargs kill -9`);
        console.error(`   2. Use a different port: PORT=3002 node server.js`);
        console.error(`   3. Check PM2 processes: pm2 list`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', err);
        process.exit(1);
      }
    });
    
    // Start listening
    server.listen(port, hostname, () => {
      console.log('');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ Server ready and listening');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`   URL: http://${hostname === '0.0.0.0' ? 'localhost' : hostname}:${port}`);
      console.log(`   Binding: ${hostname}:${port}`);
      console.log(`   PID: ${process.pid}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      
      // Verify binding (helps debug production issues)
      const address = server.address();
      if (address) {
        console.log(`🔍 Verification: Server bound to ${address.address}:${address.port}`);
      }
    });
    
    // Graceful shutdown for PM2
    const gracefulShutdown = (signal) => {
      console.log(`\n📡 Received ${signal}, starting graceful shutdown...`);
      server.close(() => {
        console.log('✅ Server closed');
        app.close();
        process.exit(0);
      });
      
      // Force shutdown after timeout
      setTimeout(() => {
        console.error('⚠️  Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };
    
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

// Start the server
startServer();
