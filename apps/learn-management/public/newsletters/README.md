# Newsletter PDFs

This directory contains newsletter PDF files that are displayed on the newsletter page.

## Adding a New Newsletter

1. **Add the PDF file** to this directory (`public/newsletters/`)
   - Name it descriptively, e.g., `newsletter-2024-01.pdf`

2. **Update the newsletters data file** at `/learn-management/data/newsletters.json`:
   ```json
   [
     {
       "id": "2024-01",
       "title": "The Skilling Newsletter - January 2024",
       "description": "New year, new courses! Discover our latest management and leadership courses.",
       "date": "2024-01-15",
       "filename": "newsletter-2024-01.pdf"
     }
   ]
   ```

3. The newsletter will automatically appear on the `/newsletter` page, sorted by date (newest first).

## Fields Explanation

- **id**: Unique identifier for the newsletter
- **title**: Display title shown on the page
- **description**: Brief description of the newsletter content
- **date**: Publication date in YYYY-MM-DD format (used for sorting)
- **filename**: Name of the PDF file (must match the file in this directory)

## Features

Users can:
- **View** newsletters in an embedded PDF viewer
- **Download** newsletters as PDF files
- Browse newsletters sorted by date (newest first)
