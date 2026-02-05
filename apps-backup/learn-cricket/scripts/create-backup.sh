#!/bin/bash

# Backup Creation Utility
# Creates timestamped backup files before modifying them
# Usage: ./scripts/create-backup.sh <file-path>

if [ -z "$1" ]; then
  echo "Usage: $0 <file-path>"
  echo "Example: $0 pages/world-cup.js"
  exit 1
fi

FILE_PATH="$1"

if [ ! -f "$FILE_PATH" ]; then
  echo "Error: File '$FILE_PATH' does not exist"
  exit 1
fi

# Get Unix timestamp
TIMESTAMP=$(date +%s)

# Create backup with .bak.<timestamp> extension
BACKUP_PATH="${FILE_PATH}.bak.${TIMESTAMP}"

# Copy file to backup
cp "$FILE_PATH" "$BACKUP_PATH"

if [ $? -eq 0 ]; then
  echo "✓ Backup created: $BACKUP_PATH"
  exit 0
else
  echo "✗ Failed to create backup"
  exit 1
fi
