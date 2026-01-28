#!/bin/bash

# Get today's date
DATE=$(date +%Y-%m-%d)
LOG_DIR="logs"
LOG_FILE="${LOG_DIR}/${DATE}-dev-log.md"

# Create logs dir if not exists
mkdir -p "$LOG_DIR"

# If the file does not exist, initialize with template
if [ ! -f "$LOG_FILE" ]; then
  cat <<EOF > "$LOG_FILE"
# Daily Dev Log – $DATE

## Summary
- 

## Next Steps
- 

---

### Raw Terminal Log

\`\`\`bash

\`\`\`
EOF
fi

echo "Appending to $LOG_FILE"

# Prompt for a summary block if file was just created
if grep -q "Summary" "$LOG_FILE" && grep -q "\- $" "$LOG_FILE"; then
  echo 'Add a summary note (or leave blank):'
  read SUM_NOTE
  if [ ! -z "$SUM_NOTE" ]; then
    # Adds the summary note after the dash under "Summary"
    sed -i "0,/- /s//- $SUM_NOTE/" "$LOG_FILE"
  fi
fi

echo "Paste your terminal commands/output (end with Ctrl-D):"
# Append clipboard/session (user will paste output, then Ctrl-D to finish)
cat >> "$LOG_FILE"

echo "Done. Log saved in $LOG_FILE"
