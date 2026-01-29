# Local Content Mode for Testing and QA

> **📢 NEW: Unified Admin Dashboard**  
> The admin dashboard now **automatically aggregates content from both Supabase AND local sources**.  
> You no longer need to enable "local content mode" - local content is always included alongside Supabase data.  
> See [UNIFIED_ADMIN_DASHBOARD.md](../UNIFIED_ADMIN_DASHBOARD.md) for details.

---

This feature allows admin UIs to read content from a local JSON snapshot instead of Supabase, making it easier to test and QA without requiring a live database connection.

## Overview

Local content mode is controlled by the environment variable `NEXT_PUBLIC_USE_LOCAL_CONTENT=true`. When enabled, the application will read data from `seeds/content.json` instead of making queries to Supabase.

## Use Cases

- **Short-term Testing**: Test admin UI functionality without affecting production data
- **QA Environment**: Create isolated QA environments with predictable test data
- **Development**: Work on UI features without needing a Supabase connection
- **Demo Mode**: Show admin features with sample data

## How to Activate

### Step 1: Create or Update .env.local

Add the following environment variable to `.env.local` in the repository root or per-application:

```bash
NEXT_PUBLIC_USE_LOCAL_CONTENT=true
```

### Step 2: Run the Application

```bash
npm run dev
```

The application will now use data from `seeds/content.json` instead of Supabase.

### Step 3: Verify Local Content Mode

When the app starts, you should see a console message:

```
🔧 LOCAL CONTENT MODE: Using mock data from seeds/content.json
```

## How to Deactivate

To return to production mode (using Supabase), simply:

1. Remove the `NEXT_PUBLIC_USE_LOCAL_CONTENT` variable from `.env.local`, OR
2. Set it to `false`: `NEXT_PUBLIC_USE_LOCAL_CONTENT=false`
3. Restart the application

## Content JSON Structure

The `seeds/content.json` file contains sample data organized by table:

- **courses**: Sample course records
- **modules**: Sample module records (linked to courses)
- **lessons**: Sample lesson records (linked to modules)
- **profiles**: Sample user profiles
- **questions**: Sample quiz questions (linked to lessons)

### Expanding Test Data

You can add more records to `seeds/content.json` to expand your test dataset:

```json
{
  "courses": [
    {
      "id": "course-4",
      "title": "New Test Course",
      "slug": "new-test-course",
      "short_description": "Description here",
      "full_description": "Full description here",
      "duration": "3 months",
      "category": "Technology",
      "subdomain": "main",
      "price": 4999,
      "is_free": false,
      "status": "published",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Supported Operations

The local content provider mimics most Supabase query operations:

### SELECT Operations
- `.select()` - Select fields
- `.eq()` - Equality filter
- `.neq()` - Not equal filter
- `.gt()`, `.gte()`, `.lt()`, `.lte()` - Comparison filters
- `.like()`, `.ilike()` - Pattern matching
- `.in()` - Array contains
- `.order()` - Sort results
- `.limit()` - Limit number of results
- `.single()` - Return single record
- `.maybeSingle()` - Return single record or null

### WRITE Operations (Mocked)
- `.insert()` - Returns success (does not persist)
- `.update()` - Returns success (does not persist)
- `.upsert()` - Returns success (does not persist)
- `.delete()` - Returns success (does not persist)

**Note**: Write operations return successful responses but do not actually modify the `content.json` file. This makes local content mode safe for testing without data persistence concerns.

## Limitations

1. **Server-side Only**: Local content mode only works in Node.js/server-side environments. Browser-side queries will fall back to the regular Supabase client (or mock client if suspended).

2. **No Authentication**: Authentication operations are not supported in local content mode. `getCurrentUser()` will return `null`.

3. **No Storage**: File upload/download operations are not supported.

4. **No RPC**: Remote procedure calls are not supported.

5. **No Data Persistence**: Write operations (insert/update/delete) do not persist changes to the JSON file.

## Testing Procedure

1. **Enable Local Content Mode**:
   ```bash
   echo "NEXT_PUBLIC_USE_LOCAL_CONTENT=true" >> .env.local
   ```

2. **Start the Application**:
   ```bash
   npm run dev
   ```

3. **Test Admin UI**:
   - Navigate to admin pages (e.g., `/admin/courses`)
   - Verify that content from `seeds/content.json` is displayed
   - Test filtering, sorting, and search features

4. **Switch Back to Production**:
   ```bash
   # Remove the environment variable
   sed -i '/NEXT_PUBLIC_USE_LOCAL_CONTENT/d' .env.local
   # Restart the app
   npm run dev
   ```

5. **Verify Production Mode**:
   - Admin pages should now show data from Supabase
   - Authentication should work normally

## Architecture

### Files Modified

- `lib/supabaseClient.js` - Main Supabase client (root)
- `apps/main/lib/supabaseClient.js` - Main app Supabase client
- `learn-management/lib/supabaseClient.js` - Learn Management app client
- `learn-apt/src/lib/supabaseClient.ts` - Learn APT app client

### Files Added

- `lib/localContentProvider.js` - Local content provider implementation
- `seeds/content.json` - Sample test data
- `seeds/README.md` - This documentation file

### How It Works

1. When `NEXT_PUBLIC_USE_LOCAL_CONTENT=true` is set, the Supabase client initialization checks for this flag.

2. If enabled and running in Node.js (server-side), it loads `localContentProvider.js` instead of creating a real Supabase client.

3. The local content provider reads `seeds/content.json` and creates a mock client that mimics the Supabase API.

4. Query operations filter and return data from the JSON file, maintaining API compatibility.

## Security Notes

- **Not for Production**: This feature is intended for local development, staging, and test environments only.
- **No Real Data**: Local content mode does not interact with your Supabase database at all.
- **Reversible**: Simply remove the environment variable to return to normal operation.
- **Safe Testing**: Write operations don't persist, so you can't accidentally corrupt your test data file.

## Troubleshooting

### "Local content file not found"

**Cause**: The `seeds/content.json` file is missing or in the wrong location.

**Solution**: Verify that `seeds/content.json` exists in the repository root.

### "Local content mode is only supported in server-side/Node.js environment"

**Cause**: Attempting to use local content mode in a browser context.

**Solution**: This is expected. The local content provider only works server-side. Browser queries will use the regular Supabase client.

### Data not showing up in admin UI

**Cause**: The data might not match the filters or structure expected by the admin UI.

**Solution**: 
1. Check the console for error messages
2. Verify your `seeds/content.json` structure matches the expected schema
3. Add more sample records with appropriate field values

### Changes not persisting

**Cause**: This is expected behavior.

**Solution**: Write operations (insert/update/delete) in local content mode do not persist. This is by design to keep the test data file pristine.

## Support

For issues or questions about local content mode:
1. Check this documentation first
2. Review the implementation in `lib/localContentProvider.js`
3. Check console logs for error messages
4. Verify your `seeds/content.json` is valid JSON

## Future Enhancements

Potential improvements for this feature:
- [ ] Support for more complex query operations (joins, aggregations)
- [ ] Optional data persistence to JSON file
- [ ] Web UI for editing test data
- [ ] Multiple test data profiles (e.g., `content-small.json`, `content-large.json`)
- [ ] Auto-generation of test data from schema
