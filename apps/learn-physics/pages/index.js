import React from 'react';
import { Layout } from '@iiskills/ui';
import Link from 'next/link';
import { getCourseMetadata } from '@iiskills/content';

export async function getStaticProps() {
  const course = getCourseMetadata('learn-physics');
  return { props: { course } };
}

export default function PhysicsHome({ course }) {
  if (!course) {
    return <Layout appName="Physics"><div style={{ padding: '2rem' }}>Course content unavailable.</div></Layout>;
  }
  return (
    <Layout appName="Physics">
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{course.title}</h1>
        <p style={{ fontSize: '1.125rem', color: '#555', marginBottom: '0.5rem' }}>{course.description}</p>
        <p style={{ color: '#888', marginBottom: '2rem' }}>Syllabus: {course.syllabusHours} hours</p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Modules</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {course.modules.map((mod) => (
            <Link key={mod.id} href={`/modules/${mod.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1.25rem', background: '#fff', cursor: 'pointer' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1a1a2e' }}>{mod.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
