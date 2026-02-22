# Static Content Guide

A reference for developers working with iiskills static-first lesson content.

---

## Overview

Lesson content is now delivered via **static generation** (Next.js `getStaticPaths` +
`getStaticProps`).  All 100 lesson pages per learning app are pre-rendered at build
time from files in the `content/` directory.  This means:

- **No runtime database calls** are needed to render lesson text.
- Pages load immediately — even when Supabase is slow or unavailable.
- 404s caused by missing DB rows are eliminated for migrated courses.
- Supabase is still used for auth, entitlements, payments, and progress tracking.

---

## Directory structure

```
content/
  content-manifest.json       # Index of all apps, modules, and lessons
  learn-physics/
    course.json               # Course + module metadata
    lessons/
      module-1/
        lesson-1.json         # Lesson content + quiz (free)
        lesson-2.json         # Lesson content + quiz (premium)
        ...                   # lesson-3.json … lesson-10.json
      module-2/
        ...
  learn-pr/
    course.json
    lessons/
      module-1/
        lesson-1.json
        ...
```

---

## How to add a lesson

1. Create the lesson JSON file at the correct path:
   ```
   content/<app-slug>/lessons/module-<N>/lesson-<M>.json
   ```

2. The file must contain these required fields:

   ```json
   {
     "moduleId": 1,
     "lessonId": 1,
     "slug": "my-lesson-slug",
     "title": "My Lesson Title",
     "isFree": false,
     "content": "<h2>...</h2><p>...</p>",
     "quiz": [
       {
         "question": "Question text?",
         "options": ["A", "B", "C", "D"],
         "correct_answer": 0
       }
     ]
   }
   ```

   Rules:
   - `isFree: true` only for `lessonId: 1` (first lesson of a module).
   - `quiz` must contain exactly 5 questions.
   - `correct_answer` is the zero-based index of the correct option.
   - `content` is an HTML string; use `<h2>`, `<h3>`, `<h4>`, `<p>`, `<strong>`.

3. Re-run the build (`yarn build`) — the new lesson will be pre-rendered automatically.

> **Build-time validation**: If a required field is missing or `quiz` is empty the
> build fails immediately with a clear error message.  This prevents broken deploys.

---

## How to publish (deploy)

```bash
# 1. Add/edit content files under content/
# 2. Commit and push to the branch
# 3. Deploy as normal — Next.js will pre-render all lesson pages on build
yarn build   # inside the target app directory, e.g. apps/learn-physics
```

The lesson pages are statically generated — no server restart needed after adding
content files.

---

## Access control

- **Free lessons** (`isFree: true`): rendered with no paywall.
- **Premium lessons** (`isFree: false`): content is rendered immediately (statically);
  a paywall overlay is shown client-side if the user is not authenticated.
- Users can dismiss the paywall to preview lesson text ("View preview only").
- Progress submission (`/api/assessments/submit`) still requires a valid session.

---

## How to debug 404s

A 404 on a lesson page means the static route was not generated.  Check:

1. `content-manifest.json` — is the module listed?
2. The lesson page file: does `getStaticPaths` cover the moduleId/lessonId?
   (Currently all 1–10 × 1–10 combinations are generated.)
3. Run `yarn build` locally and look for any validation errors in the output.

---

## How to debug 502s

1. **Check the health endpoint**: `GET /api/health` on the affected app.
   - Returns `200 { status: "ok" }` if the app is running and env vars are set.
   - Returns `503` with a list of `missing` env vars if any are absent.
2. **Check env vars** — the most common cause of 502s:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Lesson content never requires a DB call — if the page 502s, the issue is the
   Next.js process itself (PM2 crash, missing env, OOM), not Supabase.

---

## Content loader API

The `@iiskills/content-loader` package (in `packages/content-loader`) is the single
source of truth for reading lesson content.  Import it only inside `getStaticProps`
(server / build time):

```js
const path = require('path');
const { createLoader } = require('@iiskills/content-loader');

export async function getStaticProps({ params }) {
  const loader = createLoader(path.resolve(process.cwd(), '../../content'));
  const lesson = loader.getLesson('learn-physics', params.moduleId, params.lessonId);
  // lesson is null if no file exists — use your fallback generator
  return { props: { lesson: lesson || buildFallbackLesson(...) } };
}
```

### Methods

| Method | Returns |
|---|---|
| `getCourse(appSlug)` | Course metadata object, or `null` |
| `listModules(appSlug)` | Array of module objects from `course.json` |
| `listLessons(appSlug, moduleId)` | Array of lesson objects sorted by `lessonId` |
| `getLesson(appSlug, moduleId, lessonId)` | Single lesson object, or `null` |

---

## Incremental migration

The static-first system is opt-in per lesson:

- If a lesson JSON file **exists** in `content/` → static content is used.
- If a lesson JSON file **does not exist** → the inline fallback generator is used
  (same content as before, still pre-rendered at build time).

This allows gradual migration: add content files one module at a time without
breaking any existing lesson pages.

### Current migration status

| App | Modules with filesystem content |
|---|---|
| learn-physics | Module 1 (lessons 1–2) |
| learn-pr | Module 1 (lesson 1) |

---

## Sitemap

Each app exposes all lesson URLs via `content-manifest.json`.  To generate a
sitemap, read the manifest and emit one `<url>` entry per lesson.  A future
`scripts/generate-sitemap.js` will automate this.
