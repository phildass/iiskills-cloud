/**
 * API Route: Health Check
 * Returns status of the Learn Biology app
 */

export default function handler(req, res) {
  res.status(200).json({
    app: 'learn-biology',
    name: 'Learn Biology',
    status: 'healthy',
    version: '1.0.0',
    tier: 'foundation',
    isFree: true,
    port: 3026,
    subdomain: 'app12.learn-biology.iiskills.cloud',
    features: [
      'tri-level-progression',
      'gatekeeper-tests',
      'sample-engine',
      'xp-badges',
      'cross-app-integration'
    ],
    timestamp: new Date().toISOString()
  });
}
