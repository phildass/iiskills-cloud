# Lesson Styling Guide

This document describes the lesson content styling system, what Markdown/HTML features are supported,
and how authors can produce richly styled output across every learn-* app.

---

## How It Works

Lesson body content is rendered through a shared **`LessonContent`** React component
(`packages/ui/src/content/LessonContent.js`).  The component wraps HTML or React children
in a `lesson-content` container styled by
`packages/ui/src/content/lesson-content.module.css`.

Every app that displays lessons imports `LessonContent` from `@iiskills/ui/content`:

```jsx
import { LessonContent } from '@iiskills/ui/content';

// HTML content (learn-ai, learn-math, etc.)
<LessonContent html={lesson.content} />

// React children / ReactMarkdown (learn-physics)
<LessonContent>
  <ReactMarkdown>{lesson.content}</ReactMarkdown>
</LessonContent>
```

The CSS module is automatically bundled because each app has
`transpilePackages: ['@iiskills/ui']` in its `next.config.js`.

---

## Supported Markdown / HTML Features

### Headings

```markdown
# H1 – Page Title (2 rem, bold, dark)
## H2 – Section heading (1.5 rem, underline border)
### H3 – Sub-section (1.25 rem, accent blue)
#### H4 – Minor heading (1.1 rem, light blue)
```

### Paragraphs

Normal text with `line-height: 1.75` and a `1.25 em` bottom margin.
Paragraphs are separated automatically — no need for manual `<br>` tags.

### Bold and Italic

```markdown
**Bold text** appears heavier with a near-black colour.
*Italic text* appears in a slightly lighter shade.
```

### Unordered and Ordered Lists

```markdown
- First item  (blue bullet)
- Second item
  - Nested item

1. Step one
2. Step two
3. Step three
```

### Blockquotes

```markdown
> This is a callout or important quote.
> It receives a blue left border and a light-blue background.
```

### Inline Code

Use single backticks for inline code:  `` `const x = 42` ``

Inline code gets a pink colour on a light grey background.

### Code Blocks

Fenced code blocks render with a dark (navy) background and scrollable overflow:

````markdown
```python
def greet(name):
    return f"Hello, {name}!"
```
````

### Links

```markdown
[Visit iiskills.cloud](https://iiskills.cloud)
```

Links appear in blue with an underline on hover.

### Tables

```markdown
| Feature       | Supported |
|---------------|-----------|
| Headings      | ✅        |
| Bold / Italic | ✅        |
| Code blocks   | ✅        |
```

### Horizontal Rule

```markdown
---
```

Renders as a subtle grey divider.

---

## Style Reference

| Element       | Style |
|---------------|-------|
| Container     | `max-width: 72ch`, centred, `font-size: 1.0625rem`, `line-height: 1.75` |
| `h1`          | 2 rem, bold, very dark |
| `h2`          | 1.5 rem, bold, underline border |
| `h3`          | 1.25 rem, bold, accent blue (#1e40af) |
| `h4`          | 1.1 rem, light blue (#2563eb) |
| `p`           | 1.25 em bottom margin |
| `strong`      | bold, near-black |
| `em`          | italic, slate-700 |
| `ul` / `ol`   | 1.75 em left indent, blue markers |
| `blockquote`  | blue left border, pale-blue background |
| `code`        | pink on grey, 4 px radius |
| `pre`         | dark navy background, scrollable |
| `a`           | blue, underline on hover |
| `table`       | full-width, striped borders |
| `img`         | responsive, 8 px radius |

---

## Where Styles Live

| File | Purpose |
|------|---------|
| `packages/ui/src/content/lesson-content.module.css` | All lesson typography styles (CSS module) |
| `packages/ui/src/content/LessonContent.js` | React component that applies the styles |
| `packages/ui/src/content/index.js` | Exports `LessonContent` from `@iiskills/ui/content` |

To change the visual design of lessons **across all apps**, edit only
`lesson-content.module.css`.  No per-app changes are needed.

---

## Adding New Lessons

Lesson content is loaded from one of two sources depending on the app:

- **`@iiskills/content` courses** (`packages/content/courses/<courseId>/modules/<moduleId>/<lesson>.md`):  
  Standard Markdown files with optional front-matter (title, level).  
  Used in `learn-physics`.

- **Inline-generated HTML** (learn-ai, learn-math, learn-chemistry, …):  
  `generateLessonContent()` returns an HTML string with standard semantic tags
  (`<h2>`, `<h3>`, `<h4>`, `<p>`, `<strong>`, `<em>`, `<ul>`, `<li>`, etc.).  
  Pass this string to `<LessonContent html={content} />`.

Use standard semantic HTML when writing content — avoid inline `style=""` attributes,
as they will override the shared styles.
