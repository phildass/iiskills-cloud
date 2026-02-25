import React, { useState } from 'react';
import { Layout } from '@iiskills/ui/common';
import { useRouter } from 'next/router';

export default function EditLesson() {
  const router = useRouter();
  const { lessonId } = router.query;

  const [markdown, setMarkdown] = useState(`# Sample Lesson

Write your lesson content here in **Markdown**.

## Key Concepts

- Concept 1
- Concept 2
`);

  return (
    <Layout appName="Admin">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: '1px solid #ccc', borderRadius: '4px', padding: '0.4rem 0.8rem', cursor: 'pointer' }}>← Back</button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Edit Lesson: {lessonId}</h1>
        </div>

        {/* Side-by-side editor/preview */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', height: '70vh' }}>
          {/* Editor pane */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#555' }}>Editor</div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              style={{ flex: 1, padding: '1rem', fontFamily: 'monospace', fontSize: '0.875rem', border: '1px solid #ddd', borderRadius: '4px', resize: 'none', outline: 'none' }}
            />
          </div>

          {/* Preview pane */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#555' }}>Preview</div>
            <div style={{ flex: 1, padding: '1rem', border: '1px solid #ddd', borderRadius: '4px', background: '#fff', overflow: 'auto' }}>
              {/* TODO: replace with proper markdown renderer (e.g. react-markdown) */}
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{markdown}</pre>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <button style={{ background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.6rem 1.5rem', cursor: 'pointer', fontWeight: 600 }}>
            Save (stub — DB integration pending)
          </button>
          <button style={{ background: '#fff', color: '#666', border: '1px solid #ccc', borderRadius: '4px', padding: '0.6rem 1.5rem', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </div>
    </Layout>
  );
}
