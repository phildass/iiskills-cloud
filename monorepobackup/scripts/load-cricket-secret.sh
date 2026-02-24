#!/usr/bin/env bash
# scripts/load-cricket-secret.sh
# Copy $SECRETS_DIR/learn-cricket.env -> apps/learn-cricket/.env.local (chmod 600)
# Default SECRETS_DIR: $HOME/.secrets/iiskills
set -euo pipefail

SECRETS_DIR="${SECRETS_DIR:-$HOME/.secrets/iiskills}"
SECRET_FILE="$SECRETS_DIR/learn-cricket.env"
DEST="apps/learn-cricket/.env.local"

echo "Loading learn-cricket secret from: $SECRET_FILE"

if [ ! -f "$SECRET_FILE" ]; then
  echo "ERROR: secret file not found: $SECRET_FILE" >&2
  exit 1
fi

if [ ! -d "apps/learn-cricket" ]; then
  echo "ERROR: apps/learn-cricket directory not found" >&2
  exit 2
fi

cp "$SECRET_FILE" "$DEST"
chmod 600 "$DEST"

echo "Wrote $DEST (mode 600). Do NOT commit this file."
exit 0
