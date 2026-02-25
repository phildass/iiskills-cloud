import React from 'react';
import { Layout } from '@iiskills/ui/common';
import Link from 'next/link';

// Mock data for Master Grid
const MOCK_LESSONS = [
  { id: 'l1', title: 'Introduction to Mechanics', module: 'Mechanics', status: 'Published', updatedAt: '2026-02-24' },
  { id: 'l2', title: "Newton's Laws", module: 'Mechanics', status: 'Draft', updatedAt: '2026-02-23' },
  { id: 'l3', title: 'Thermodynamics Basics', module: 'Thermodynamics', status: 'Published', updatedAt: '2026-02-22' },
];

export default function AdminHome() {
  return (
    <Layout appName="Admin">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem' }}>Admin Dashboard</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1a1a2e' }}>3</div>
            <div style={{ color: '#666' }}>Total Lessons</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1a1a2e' }}>2</div>
            <div style={{ color: '#666' }}>Published</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1a1a2e' }}>1</div>
            <div style={{ color: '#666' }}>Drafts</div>
          </div>
        </div>

        {/* Master Grid */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Lesson Master Grid</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ background: '#1a1a2e', color: '#fff' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Title</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Module</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Updated</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_LESSONS.map((lesson, i) => (
              <tr key={lesson.id} style={{ borderBottom: '1px solid #eee', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={{ padding: '0.75rem 1rem' }}>{lesson.title}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{lesson.module}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ background: lesson.status === 'Published' ? '#d4edda' : '#fff3cd', color: lesson.status === 'Published' ? '#155724' : '#856404', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {lesson.status}
                  </span>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: '#666' }}>{lesson.updatedAt}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <Link href={`/edit/${lesson.id}`} style={{ color: '#1a1a2e', textDecoration: 'none', fontWeight: 500 }}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
