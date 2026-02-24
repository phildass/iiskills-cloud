import React from 'react';
import { Layout } from '@iiskills/ui';
import Link from 'next/link';
import { getCourseMetadata, getLessonsForModule } from '@iiskills/content';

export async function getStaticPaths() {
  const course = getCourseMetadata('learn-physics');
  if (!course) return { paths: [], fallback: false };
  const paths = course.modules.map((m) => ({ params: { moduleId: m.id } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const course = getCourseMetadata('learn-physics');
  const module = course.modules.find((m) => m.id === params.moduleId);
  const lessons = getLessonsForModule('learn-physics', params.moduleId);
  return { props: { module, lessons } };
}

export default function ModulePage({ module, lessons }) {
  return (
    <Layout appName="Physics">
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>{module.title}</h1>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>Lessons</h2>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {lessons.map((lessonFile) => (
            <Link key={lessonFile} href={`/modules/${module.id}/${lessonFile.replace('.md', '')}`} style={{ textDecoration: 'none' }}>
              <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1rem', background: '#fff' }}>
                {lessonFile.replace('.md', '').replace(/-/g, ' ')}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
