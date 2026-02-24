# Moderation API Endpoints

This directory contains the API endpoints for the content moderation system.

## Endpoints

### GET /api/moderation/entries

Fetches all moderation entries and statistics.

**Access:** Requires `NEXT_PUBLIC_ADMIN_SETUP_MODE=true`

**Response:**
```json
{
  "entries": [...],
  "stats": {
    "total": 12,
    "flagged": 7,
    "approved": 3,
    "rejected": 2,
    "contentTypes": {...}
  }
}
```

### POST /api/moderation/update

Updates the status of a moderation entry.

**Access:** Requires `NEXT_PUBLIC_ADMIN_SETUP_MODE=true`

**Request:**
```json
{
  "id": "entry-id",
  "status": "approved|rejected|flagged"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Entry updated successfully"
}
```

## Error Responses

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `403` - Forbidden (admin mode not enabled)
- `405` - Method Not Allowed
- `500` - Internal Server Error

## See Also

- Main documentation: `../../docs/MODERATION_DASHBOARD.md`
- Utility functions: `../../lib/moderationUtils.js`
- Dashboard page: `../admin/moderation.js`
