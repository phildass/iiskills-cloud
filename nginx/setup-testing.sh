#!/usr/bin/env bash
# setup-testing.sh — Deploy IISkills testing-period nginx configuration
#
# Installs Basic Auth, the testing HTML page, the auth snippet, all vhost
# configs, enables them via symlinks in sites-enabled/, then validates and
# reloads nginx.
#
# Usage (run as root or with sudo):
#   sudo bash nginx/setup-testing.sh
#
# Requirements:
#   - apache2-utils (for htpasswd)
#   - nginx
#   - TLS certificate at /etc/ssl/iiskills/{fullchain,privkey}.pem

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── 1. Install htpasswd ────────────────────────────────────────────────────────
echo "[1/7] Installing apache2-utils (htpasswd)..."
apt-get update -qq
apt-get install -y -qq apache2-utils

# ── 2. Create Basic Auth credentials ──────────────────────────────────────────
echo "[2/7] Creating Basic Auth credentials..."
mkdir -p /etc/nginx/auth
# Password can be supplied via the IISKILLS_TESTING_PASSWORD env variable.
# If not set, the default testing-period password is used.
HTPASSWD_PASSWORD="${IISKILLS_TESTING_PASSWORD:-LizMon2610@4ever}"
printf '%s\n%s\n' "${HTPASSWD_PASSWORD}" "${HTPASSWD_PASSWORD}" | \
    htpasswd -c /etc/nginx/auth/iiskills-testing.htpasswd authorized
unset HTPASSWD_PASSWORD
chmod 600 /etc/nginx/auth/iiskills-testing.htpasswd

# ── 3. Deploy static testing page ─────────────────────────────────────────────
echo "[3/7] Deploying static testing page..."
mkdir -p /var/www/iiskills-testing
cp "${SCRIPT_DIR}/static/testing.html" /var/www/iiskills-testing/testing.html
chmod 644 /var/www/iiskills-testing/testing.html

# ── 4. Deploy nginx auth snippet ──────────────────────────────────────────────
echo "[4/7] Deploying nginx auth snippet..."
mkdir -p /etc/nginx/snippets
cp "${SCRIPT_DIR}/snippets/iiskills-basic-auth.conf" \
   /etc/nginx/snippets/iiskills-basic-auth.conf

# ── 5. Deploy vhost configs to sites-available ────────────────────────────────
echo "[5/7] Deploying vhost configs to /etc/nginx/sites-available/..."
SITES=(
    iiskills.cloud
    learn-ai.iiskills.cloud
    learn-apt.iiskills.cloud
    learn-chemistry.iiskills.cloud
    learn-developer.iiskills.cloud
    learn-geography.iiskills.cloud
    learn-management.iiskills.cloud
    learn-math.iiskills.cloud
    learn-physics.iiskills.cloud
    learn-pr.iiskills.cloud
    app.iiskills.cloud
    app1.learn-ai.iiskills.cloud
    app1.learn-developer.iiskills.cloud
)
for site in "${SITES[@]}"; do
    cp "${SCRIPT_DIR}/sites-available/${site}" "/etc/nginx/sites-available/${site}"
    echo "  copied ${site}"
done

# ── 6. Enable sites via symlinks ──────────────────────────────────────────────
echo "[6/7] Enabling sites in /etc/nginx/sites-enabled/..."
for site in "${SITES[@]}"; do
    ln -sf "/etc/nginx/sites-available/${site}" "/etc/nginx/sites-enabled/${site}"
    echo "  enabled ${site}"
done

# ── 7. Validate and reload nginx ──────────────────────────────────────────────
echo "[7/7] Validating nginx configuration..."
nginx -t
echo "Reloading nginx..."
systemctl reload nginx

echo ""
echo "✅ Done. Testing-period access control is active."
echo ""
echo "── Verification (expect 401 on /, 200 on /testing) ──────────────────────"
for domain in iiskills.cloud learn-ai.iiskills.cloud learn-developer.iiskills.cloud; do
    echo -n "  https://${domain}/testing → "
    curl -sk -o /dev/null -w "%{http_code}\n" "https://${domain}/testing" || true
    echo -n "  https://${domain}/        → "
    curl -sk -o /dev/null -w "%{http_code}\n" "https://${domain}/"        || true
done
echo ""
echo "── Canonical redirect verification (expect 301) ─────────────────────────"
for domain in app.iiskills.cloud app1.learn-ai.iiskills.cloud app1.learn-developer.iiskills.cloud; do
    echo -n "  https://${domain} → "
    curl -sk -o /dev/null -w "%{http_code}  Location: %{redirect_url}\n" \
         "https://${domain}" || true
done
