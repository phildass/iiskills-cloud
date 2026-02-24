import React from 'react';
import { Layout } from '@iiskills/ui';
import ReactMarkdown from 'react-markdown';
import { getCourseMetadata, getLessonsForModule, getLesson } from '@iiskills/content';

export async function getStaticPaths() {
  const course = getCourseMetadata('learn-physics');
  if (!course) return { paths: [], fallback: false };
  const paths = [];
  for (const mod of course.modules) {
    const lessons = getLessonsForModule('learn-physics', mod.id);
    for (const lessonFile of lessons) {
      paths.push({ params: { moduleId: mod.id, lessonId: lessonFile.replace('.md', '') } });
    }
  }
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const lesson = getLesson('learn-physics', params.moduleId, params.lessonId + '.md');
  return { props: { lesson, moduleId: params.moduleId } };
}

export default function LessonPage({ lesson, moduleId }) {
  return (
    <Layout appName="Physics">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ color: '#888', fontSize: '0.875rem' }}>Module: {moduleId}</span>
          {lesson.frontmatter.level && (
            <span style={{ marginLeft: '1rem', background: '#e8f4fd', color: '#1a6bb5', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
              {lesson.frontmatter.level}
            </span>
          )}
        </div>
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <ReactMarkdown>{lesson.content}</ReactMarkdown>
        </div>
      </div>
    </Layout>
  );
}
