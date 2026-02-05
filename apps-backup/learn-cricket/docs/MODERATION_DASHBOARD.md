# Cricket Universe - Moderation Dashboard

## Overview

The moderation dashboard provides a centralized interface for reviewing and managing AI-generated content that has been flagged for review. This system helps maintain content quality and safety across the Cricket Universe learning platform.

## Features

### 📊 Dashboard Features
- **Real-time Statistics**: View total entries, flagged content, approved items, and rejections
- **Advanced Filtering**: Filter by status (all, flagged, approved, rejected) and content type
- **Search Functionality**: Search across content types and reasons
- **Pagination**: Browse entries with 10 items per page
- **Action Buttons**: Approve or reject flagged content with one click
- **Dark Theme**: Modern dark interface matching the Cricket Universe design

### 🔒 Security
- Requires `NEXT_PUBLIC_ADMIN_SETUP_MODE=true` to access
- Access denied page shown when mode is disabled
- API endpoints validate admin mode before processing requests

## File Structure

```
apps/learn-cricket/
├── pages/
│   ├── admin/
│   │   └── moderation.js          # Main moderation dashboard page
│   └── api/
│       └── moderation/
│           ├── entries.js          # GET endpoint for fetching entries
│           └── update.js           # POST endpoint for updating entries
├── lib/
│   └── moderationUtils.js          # Utility functions for moderation
└── logs/
    └── ai-content-audit.log        # Audit log file (JSON lines format)
```

## Setup

### 1. Enable Admin Mode

Add to your `.env.local` file:

```env
NEXT_PUBLIC_ADMIN_SETUP_MODE=true
```

### 2. Access the Dashboard

Navigate to: `http://localhost:3009/admin/moderation`

## Usage

### Viewing Flagged Content

1. Open the moderation dashboard
2. View statistics at the top showing total, flagged, approved, and rejected entries
3. Browse the table of entries showing:
   - Timestamp
   - Content Type
   - Reason for flagging
   - Current Status
   - Action buttons

### Filtering Entries

**By Status:**
- Select from dropdown: All Status, Flagged, Approved, Rejected

**By Content Type:**
- Select from dropdown showing all unique content types in the log

**By Search:**
- Type keywords to search content types and reasons

### Taking Action

**Approve Content:**
- Click the "Approve" button to mark content as safe
- Button is disabled if already approved

**Reject Content:**
- Click the "Reject" button to mark content as inappropriate
- Button is disabled if already rejected

### Pagination

- Use "Previous" and "Next" buttons to navigate pages
- View current page number and total pages
- See entry count (e.g., "Showing 1 to 10 of 45 entries")

## API Endpoints

### GET /api/moderation/entries

Fetch all moderation entries and statistics.

**Response:**
```json
{
  "entries": [
    {
      "id": "entry-1706956800000-abc123",
      "timestamp": "2024-02-03T08:00:00.000Z",
      "contentType": "quiz-question",
      "reason": "Potentially inappropriate language",
      "status": "flagged",
      "content": "What is the best way to hit a six?",
      "metadata": {
        "module": "batting-basics",
        "severity": "low"
      }
    }
  ],
  "stats": {
    "total": 12,
    "flagged": 6,
    "approved": 4,
    "rejected": 2,
    "contentTypes": {
      "quiz-question": 4,
      "lesson-content": 3,
      "news-article": 2,
      "user-comment": 2,
      "daily-challenge": 1
    }
  }
}
```

### POST /api/moderation/update

Update the status of a moderation entry.

**Request Body:**
```json
{
  "id": "entry-1706956800000-abc123",
  "status": "approved"
}
```

**Valid Statuses:** `flagged`, `approved`, `rejected`

**Response:**
```json
{
  "success": true,
  "message": "Entry updated successfully"
}
```

## Utility Functions

### readAuditLog()

Reads and parses the audit log file.

```javascript
import { readAuditLog } from '../lib/moderationUtils';

const entries = await readAuditLog();
```

### updateLogEntry(id, newStatus)

Updates a log entry status.

```javascript
import { updateLogEntry } from '../lib/moderationUtils';

const success = await updateLogEntry('entry-id', 'approved');
```

### filterLogEntries(entries, filters)

Filters entries based on criteria.

```javascript
import { filterLogEntries } from '../lib/moderationUtils';

const filtered = filterLogEntries(entries, {
  status: 'flagged',
  search: 'quiz',
  contentType: 'quiz-question'
});
```

### getModerationStats()

Gets moderation statistics.

```javascript
import { getModerationStats } from '../lib/moderationUtils';

const stats = await getModerationStats();
// Returns: { total, flagged, approved, rejected, contentTypes }
```

### addAuditLogEntry(entry)

Adds a new audit log entry (for integration with AI systems).

```javascript
import { addAuditLogEntry } from '../lib/moderationUtils';

await addAuditLogEntry({
  contentType: 'quiz-question',
  reason: 'Grammar check failed',
  content: 'Sample question text',
  metadata: { module: 'basics', severity: 'low' }
});
```

## Log File Format

The audit log uses JSON Lines format (one JSON object per line):

```json
{"id":"entry-123","timestamp":"2024-02-03T08:00:00.000Z","contentType":"quiz-question","reason":"Flagging reason","status":"flagged","content":"Content text","metadata":{}}
```

**Fields:**
- `id`: Unique identifier for the entry
- `timestamp`: ISO 8601 timestamp
- `contentType`: Type of content (e.g., quiz-question, lesson-content)
- `reason`: Reason for flagging
- `status`: Current status (flagged, approved, rejected)
- `content`: The actual content text
- `metadata`: Additional metadata (module, severity, etc.)

## Error Handling

### Missing Log File
- Automatically creates logs directory if it doesn't exist
- Returns empty array if log file is not found
- Gracefully handles file read errors

### Invalid Log Entries
- Skips malformed JSON lines
- Logs parsing errors to console
- Continues processing valid entries

### API Errors
- Returns appropriate HTTP status codes
- Includes error messages in response
- Validates required fields and status values

## Integration with AI Systems

To integrate with AI content generation:

```javascript
import { addAuditLogEntry } from './lib/moderationUtils';

async function generateAndAuditContent(prompt) {
  const content = await aiGenerate(prompt);
  
  // Check content quality
  if (needsReview(content)) {
    await addAuditLogEntry({
      contentType: 'ai-generated',
      reason: 'AI confidence below threshold',
      content: content,
      metadata: {
        prompt: prompt,
        confidence: 0.75,
        severity: 'medium'
      }
    });
  }
  
  return content;
}
```

## Styling

The dashboard uses a dark theme with:
- Background: `bg-gray-900`
- Cards: `bg-gray-800` with `border-gray-700`
- Text: `text-white`, `text-gray-300`, `text-gray-400`
- Status badges:
  - Flagged: Yellow (`bg-yellow-900/30`, `text-yellow-400`)
  - Approved: Green (`bg-green-900/30`, `text-green-400`)
  - Rejected: Red (`bg-red-900/30`, `text-red-400`)

## Sample Data

The system includes 12 sample entries for testing:
- Quiz questions
- Lesson content
- News articles
- User comments
- Daily challenges
- User submissions

Statuses are pre-mixed (flagged, approved, rejected) to demonstrate all features.

## Troubleshooting

### "Access Denied" Error
- Check that `NEXT_PUBLIC_ADMIN_SETUP_MODE=true` is set in `.env.local`
- Restart the development server after changing environment variables

### No Entries Showing
- Check that `logs/ai-content-audit.log` exists
- Verify the log file contains valid JSON lines
- Check browser console for API errors

### Updates Not Saving
- Verify write permissions on the logs directory
- Check API response in Network tab for error messages
- Ensure log file is not locked by another process

## Future Enhancements

Potential improvements:
- Bulk actions (approve/reject multiple entries)
- Export to CSV functionality
- Advanced analytics and reporting
- Email notifications for high-severity flags
- Content preview modal
- Audit trail for moderator actions
- Integration with Supabase for persistent storage
- Role-based access control
- Automated moderation rules

## License

Part of the Cricket Universe learning platform.
