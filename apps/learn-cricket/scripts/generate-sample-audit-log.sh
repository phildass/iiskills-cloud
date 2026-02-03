#!/bin/bash

# Generate sample audit log entries for testing the moderation dashboard

LOG_FILE="./logs/ai-content-audit.log"

echo "Generating sample audit log entries..."

mkdir -p ./logs

cat > "$LOG_FILE" << 'EOF'
{"id":"entry-1706956800000-abc123","timestamp":"2024-02-03T08:00:00.000Z","contentType":"quiz-question","reason":"Potentially inappropriate language detected","status":"flagged","content":"What is the best way to hit a six?","metadata":{"module":"batting-basics","severity":"low"}}
{"id":"entry-1706960400000-def456","timestamp":"2024-02-03T09:00:00.000Z","contentType":"lesson-content","reason":"Factual accuracy needs verification","status":"flagged","content":"Cricket was invented in 1850","metadata":{"module":"history-of-cricket","severity":"medium"}}
{"id":"entry-1706964000000-ghi789","timestamp":"2024-02-03T10:00:00.000Z","contentType":"news-article","reason":"Contains unverified claims","status":"approved","content":"India wins the World Cup","metadata":{"source":"automated-scraper","severity":"high"}}
{"id":"entry-1706967600000-jkl012","timestamp":"2024-02-03T11:00:00.000Z","contentType":"user-comment","reason":"Spam detection triggered","status":"rejected","content":"Click here for free cricket bats","metadata":{"userId":"user-123","severity":"high"}}
{"id":"entry-1706971200000-mno345","timestamp":"2024-02-03T12:00:00.000Z","contentType":"quiz-question","reason":"Duplicate content detected","status":"flagged","content":"Who won the 2019 Cricket World Cup?","metadata":{"module":"world-cup-trivia","severity":"low"}}
{"id":"entry-1706974800000-pqr678","timestamp":"2024-02-03T13:00:00.000Z","contentType":"lesson-content","reason":"Outdated statistics","status":"approved","content":"Sachin Tendulkar's career statistics","metadata":{"module":"cricket-legends","severity":"low"}}
{"id":"entry-1706978400000-stu901","timestamp":"2024-02-03T14:00:00.000Z","contentType":"daily-challenge","reason":"Difficulty level mismatch","status":"flagged","content":"Calculate the run rate in a T20 match","metadata":{"difficulty":"beginner","severity":"medium"}}
{"id":"entry-1706982000000-vwx234","timestamp":"2024-02-03T15:00:00.000Z","contentType":"user-submission","reason":"Copyright concern","status":"rejected","content":"Screenshot from official broadcast","metadata":{"userId":"user-456","severity":"high"}}
{"id":"entry-1706985600000-yza567","timestamp":"2024-02-03T16:00:00.000Z","contentType":"news-article","reason":"Missing source attribution","status":"flagged","content":"Latest cricket match updates","metadata":{"source":"automated-scraper","severity":"medium"}}
{"id":"entry-1706989200000-bcd890","timestamp":"2024-02-03T17:00:00.000Z","contentType":"quiz-question","reason":"Ambiguous wording","status":"approved","content":"What does LBW stand for?","metadata":{"module":"cricket-terminology","severity":"low"}}
{"id":"entry-1706992800000-efg123","timestamp":"2024-02-03T18:00:00.000Z","contentType":"lesson-content","reason":"Grammar and spelling errors","status":"flagged","content":"Cricket is play with bat and ball","metadata":{"module":"introduction","severity":"medium"}}
{"id":"entry-1706996400000-hij456","timestamp":"2024-02-03T19:00:00.000Z","contentType":"user-comment","reason":"Potential misinformation","status":"flagged","content":"Cricket has 15 players per team","metadata":{"userId":"user-789","severity":"high"}}
EOF

ENTRY_COUNT=$(wc -l < "$LOG_FILE")
echo "✓ Generated $ENTRY_COUNT sample entries in $LOG_FILE"
echo ""
echo "Sample data breakdown:"
echo "  - Flagged: $(grep -c '"status":"flagged"' "$LOG_FILE")"
echo "  - Approved: $(grep -c '"status":"approved"' "$LOG_FILE")"
echo "  - Rejected: $(grep -c '"status":"rejected"' "$LOG_FILE")"
echo ""
echo "To view the moderation dashboard:"
echo "  1. Set NEXT_PUBLIC_ADMIN_SETUP_MODE=true in .env.local"
echo "  2. Run: npm run dev"
echo "  3. Visit: http://localhost:3009/admin/moderation"
