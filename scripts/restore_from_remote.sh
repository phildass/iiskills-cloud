#!/usr/bin/env bash
set -euo pipefail

# Script to restore missing files that exist on origin/main
# Requires apps_audit.txt to be generated first

audit="apps_audit.txt"
if [ ! -f "$audit" ]; then
  echo "ERROR: $audit not found. Run the audit script first."
  exit 1
fi

current_app=""

while IFS= read -r line; do
  # parse lines like: "App: learn-apt" or "  MISSING: public"
  if [[ $line == App:* ]]; then
    current_app=$(echo "$line" | cut -d':' -f2 | tr -d ' ')
  elif [[ $line =~ MISSING:\ (.*) ]]; then
    file=$(echo "${BASH_REMATCH[1]}")
    # strip quotes if present
    file=${file//\"/}
    path="apps/${current_app}/${file}"
    
    # check if path exists in origin/main
    if git ls-tree -r --name-only origin/main -- "$path" | grep -q .; then
      echo "Restoring $path from origin/main..."
      git checkout origin/main -- "$path"
    else
      echo "Remote does not contain $path — skipping"
    fi
  fi
done < "$audit"

echo "Done. Run 'git status' to review restored files."
